import "../indiv-article.css";
import MathJaxProvider from "../mathjaxProvider";

import { Prism } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import vruntime_code from "./vruntime_code";
import deadline_code from "./deadline_code";
import matrix_multiply_code from "./matrix_multiply";
import tanh_code from "./tanh";
import softmax_code from "./softmax";
import forward_policy from "./policy";

export default function RlScheduler() {
    return (
        <MathJaxProvider>
            <div className="indiv-article">
                <h1>Adaptive Kernel Scheduler</h1>
                <div className="article-body">
                    <p>
                        Linux schedulers are built on carefully tuned
                        heuristics. However, they are static and apply the same
                        rules across all workloads. Modern systems run a wide
                        range of workloads, from latency-sensitive tasks to long
                        and heavy workloads. A single, fixed scheduling policy
                        cannot optimally serve all of these use cases.
                        Sometimes, this leads to high latency or unfair resource
                        allocation under certain workloads. My goal was to move
                        beyond this limitation by enabling the scheduler to
                        learn from runtime behavior.
                    </p>
                    <h2>What exactly is a scheduler?</h2>
                    <p>
                        A process scheduler in an operating system decides which
                        process to run next. Yet my computer appears to run
                        Spotify, Valorant, and 20 Chrome tabs all at the same
                        time. If that’s the case, why do we need a scheduler at
                        all? The answer lies in how modern CPUs share time among
                        competing processes. Even on multi-core systems,
                        resources are finite, and the scheduler must constantly
                        decide who gets the CPU and for how long.
                    </p>
                    <p>
                        You can think of this process as a game of
                        <i> "Overcooked"</i>, where each incoming task is a new
                        order and each player represents a CPU core. Despite
                        having only a limited number of players, the kitchen can
                        handle a large number of orders through proper
                        scheduling, deciding what each player should work on at
                        the right time so that no customer waits too long. In
                        the same way, a scheduler must ensure that all tasks in
                        the runqueue are completed before their deadlines
                        expire.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/RLSched/overcooked.jpg"
                            style={{ width: "60%" }}
                        />
                        <i>
                            Credits: &nbsp;
                            <a
                                href="https://www.team17.com/games/overcooked"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                team17.com/games/overcooked
                            </a>
                        </i>
                    </div>
                    <h2>How does Linux schedule processes?</h2>
                    <p>
                        Linux uses the Completely Fair Scheduler (CFS) to
                        schedule tasks, prioritizing fairness rather than
                        relying solely on static priorities. CFS ensures that
                        each task receives CPU time and is not starved. Each
                        process is assigned a virtual runtime (vruntime), which
                        indirectly represents the amount of processor time it
                        has consumed relative to other tasks in the runqueue
                        (more on this later). When selecting the next task to
                        run, CFS chooses the task with the smallest virtual
                        deadline, calculated based on its vruntime. This
                        scheduling approach is derived from the Earliest
                        Deadline First (EDF) algorithm and is implemented in the
                        Linux kernel as Earliest Eligible Virtual Deadline First
                        (EEVDF). This design ensures that no process is unfairly
                        starved of CPU time. At a high level, CFS sounds simple,
                        but its behavior is driven by several carefully designed
                        mechanisms. Understanding how vruntime, weights, and
                        virtual deadlines interact is key to understanding how
                        Linux schedules processes in practice. Now that we know
                        how CFS works on high level, let's dive deeper into the
                        code.
                    </p>
                    <p>
                        When a new task is created, it is assigned the minimum
                        vruntime among all tasks currently in the runqueue. But
                        why the minimum? If vruntime represents the amount of
                        processing time a task has consumed, shouldn’t it start
                        at zero?
                    </p>
                    <p>
                        The reason for this choice is to keep the scheduler
                        fair. Consider a scenario where task A has been running
                        for a long time and is the only task in the runqueue. If
                        a new task B is initialized at this point and assigned a
                        vruntime of zero, task A would not be scheduled again
                        until task B has consumed the same amount of processor
                        time. This would effectively cause task A to starve. To
                        avoid this, task B is instead assigned the minimum
                        vruntime in the runqueue, which, in this case, is the
                        vruntime of task A.
                    </p>
                    <p>
                        How is this minimum vruntime calculated? In the Linux
                        scheduler, the runqueue’s min_vruntime is updated on
                        every scheduler tick. At each tick, CFS examines the
                        task with the smallest vruntime and compares it against
                        the current min_vruntime. If the task’s vruntime exceeds
                        the stored minimum, min_vruntime is changed to this
                        value.
                    </p>
                    <div className="code-block">
                        <h3>
                            Oversimplified version of kernel code to calculate
                            min_vruntime
                        </h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {vruntime_code}
                        </Prism>
                    </div>
                    <p>
                        Now that we have the <i>vruntime</i> for each task and
                        the
                        <i>min_vruntime</i>, we can begin ordering tasks in the
                        runqueue. The runqueue is implemented as a red-black
                        tree, allowing O(log n) insertion and deletion. Tasks
                        are ordered based on their virtual deadlines rather than
                        raw runtime.
                    </p>

                    <p>
                        These virtual deadlines are calculated using a task’s
                        <i> vruntime</i> and its NICE value, which allows users
                        to manually prioritize or deprioritize tasks. The
                        virtual deadline is computed as follows:
                    </p>

                    <div className="math-block">
                        {
                            "$$\\text{deadline} = \\text{vruntime} + \\text{slice} \\cdot \\frac{\\text{NICE\_0\_WEIGHT}}{\\text{task\_weight}}$$"
                        }
                    </div>
                    <p>
                        Here, NICE_0_WEIGHT represents the scheduling weight
                        associated with a NICE value of 0. Similarly,
                        task_weight is derived from the custom NICE value
                        provided by the user. The slice parameter defines the
                        default duration for which a task is allowed to execute
                        and is set to 700,000 by default unless overridden.
                    </p>
                    <p>
                        CFS selects the task with the lowest virtual deadline
                        from the runqueue and begins executing it. The task
                        continues to run until its deadline exceeds that of the
                        next task in the runqueue and it has executed for at
                        least the default slice duration (700,000 ns). At this
                        point, the current state of the CPU while running this
                        task is stored in a struct and a new task is scheduled
                        to run.
                    </p>
                    <div className="code-block">
                        <h3>
                            Oversimplified version of kernel code to calculate
                            deadline and preempt
                        </h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {deadline_code}
                        </Prism>
                    </div>
                    <h2>Adaptive Learning</h2>
                    <p>
                        Up to this point, we have seen how Linux relies on fixed
                        rules to balance fairness and responsiveness. In
                        practice, however, different workloads place very
                        different demands on the scheduler, often requiring
                        distinct scheduling strategies for optimal performance.
                        This raises a natural question: instead of relying on
                        fixed rules, can the scheduler learn to adapt to
                        changing workloads and make smarter scheduling
                        decisions?
                    </p>
                    <p>
                        As we saw earlier, the virtual deadline of a task plays
                        a crucial role in determining which task runs next. But
                        what if, instead of relying on fixed heuristics, we
                        could use learning-based methods to influence this
                        virtual deadline?
                    </p>

                    <div className="math-block">
                        {
                            "$$\\text{deadline} = \\text{vruntime} + \\text{slice} \\cdot \\frac{\\text{NICE\_0\_WEIGHT}}{\\text{task\_weight}}$$"
                        }
                    </div>

                    <p>
                        In the current design, the slice term is the same for
                        every task and is set to 700,000 ns by default. Rather
                        than keeping this value fixed, we can use reinforcement
                        learning to adapt the slice dynamically based on
                        observed workload behavior and system conditions.
                        Metrics such as a task’s wait time, and burst time can
                        be used to inform these decisions.
                    </p>
                    <h2>Proximal Policy Optimization (PPO)</h2>
                    <p>
                        Even though scheduling decisions are discrete and made
                        periodically, the inputs to the scheduler such as burst
                        time and wait time are continuous. For this case, a
                        reinforcement learning algorithm like Proximal Policy
                        Optimization (PPO) is well suited, as it can operate
                        over continuous state spaces while producing stable
                        policy updates.
                    </p>
                    <p>
                        On a high level, it is a RL algorithm with an actor and
                        a critic. The actor or the policy interacts with the
                        environment and receives some reward from the
                        environment and the critic evaluates how good the action
                        taken is. This separation allows the policy to improve
                        its decisions while relying on the critic for stable and
                        low-variance learning signals. If you are interested in
                        learning more about PPO, this is the{" "}
                        <a href="https://arxiv.org/abs/1707.06347">
                            original PPO paper
                        </a>
                        .
                    </p>
                    <h2>The Agent</h2>
                    <p>
                        To make scheduling decisions, I use a set of task-level
                        and queue-level metrics as inputs to the agent. These
                        include a task’s last wait time, average wait time, last
                        burst time, and average burst time, as well as the
                        runqueue’s average wait time and average burst time. The
                        task-level metrics allow the agent to make decisions
                        that are responsive to individual tasks, while the
                        queue-level metrics ensure that these decisions account
                        for overall system behavior and do not unfairly ignore
                        other runnable tasks.
                    </p>
                    <p>
                        As discussed earlier, I want to work on changing the
                        default task time slice of 700,000 ns. Hence, the action
                        space starts at 70,000 ns (one tenth of the default) to
                        enable shorter execution windows and lower virtual
                        deadlines for latency-sensitive tasks, and extends to
                        1,120,000 ns in increments of 105,000 µs. The policy
                        outputs a discrete probability distribution over these
                        slice values, from which a slice is sampled and assigned
                        to the task at each scheduling decision.
                    </p>
                    <p>
                        The next step was designing the reward function, a
                        critical component that directly shapes the agent’s
                        behavior. The primary objective was to minimize task
                        wait times while avoiding excessive burst fragmentation
                        and unnecessary context switches. To achieve this, the
                        reward function was designed to favor low wait times,
                        longer burst execution, and fewer context switches.
                    </p>
                    <p>
                        A naive approach would be to define the reward solely
                        based on the current task’s most recent metrics.
                        However, such a formulation would result in a greedy
                        policy that prioritizes short-term gains for the current
                        task, potentially leading to starvation of other
                        runnable tasks. To prevent this, I used runqueue-level
                        signals, specifically average wait time and turnaround
                        time, into the reward formulation. As a result, the
                        reward function encourages minimizing overall
                        context-switch overhead and average wait time while
                        maximizing average turnaround time across the runqueue.
                    </p>
                    <div className="math-block math-block--row">
                        {`
                            $$
                            s_t =
                            \\begin{bmatrix}
                            w^{(t)}_{\\text{last}} \\\\
                            w^{(t)}_{\\text{avg}} \\\\
                            b^{(t)}_{\\text{last}} \\\\
                            b^{(t)}_{\\text{avg}} \\\\
                            \\bar{w}_{\\text{rq}} \\\\
                            \\bar{b}_{\\text{rq}} \\end{bmatrix}
                            $$
                        `}
                        &emsp;&emsp;
                        {`
                            $$
                            a_t \\in
                            \\{70{,}000,\\; 175{,}000,\\; 280{,}000,\\; \\dots,\\; 1{,}120{,}000\\}
                            \\, \\mu s
                            $$
                        `}
                    </div>
                    <div className="math-block">
                        {`
                            $$
                            R_t =
                            - \\alpha \\cdot \\bar{w}_{rq}
                            + \\beta \\cdot \\bar{b}_{rq}
                            - \\gamma \\cdot c_t
                            $$
                        `}
                    </div>
                    <p>
                        I use a neural network as the policy to make scheduling
                        decisions based on the observed state. The policy
                        network consists of two hidden layers with tanh
                        activation functions, followed by a softmax output layer
                        that produces a probability distribution over the
                        discrete action space. The first hidden layer contains
                        50 nodes, and the second contains 70 nodes. This
                        relatively small architecture was chosen to minimize
                        latency and memory overhead, which are critical
                        constraints when deploying a model inside the kernel.
                    </p>
                    <h2>The Simulator</h2>
                    <p>
                        At this point, the next challenge was deciding where to
                        train the RL agent. Training directly in the kernel was
                        impractical, as it would require manually extracting
                        logs to userspace, training there, and repeatedly
                        updating the kernel with new parameters. To simplify
                        this process and enable faster iteration, I decided to
                        build a custom scheduler simulator in Python. The
                        simulator attempts to replicate Linux’s CFS as closely
                        as possible, with each subroutine and scheduling
                        decision implemented to mirror the kernel logic. I also
                        implemented a custom version of PPO, using separate
                        neural networks for the actor and critic, and integrated
                        it directly with the simulator. The code for this
                        simulator can be found{" "}
                        <a href="https://github.com/vrushang1234/nice-rl-agent/tree/main">
                            here
                        </a>
                        .
                    </p>
                    <p>
                        To train the agent, I created a set of synthetic task
                        types, including long-lasting CPU-heavy tasks, tasks
                        with short CPU bursts, and tasks with short I/O bursts.
                        Multiple instances of these tasks were periodically
                        added to the simulator, forming a dynamic workload. At
                        each scheduling decision, the RL agent selected a time
                        slice for the currently running task and trained on the
                        resulting system behavior.
                    </p>
                    <p>
                        After training, I evaluated the adaptive scheduler
                        against the stock CFS implementation in my simulator.
                        Both schedulers were tested using identical workloads,
                        with tasks having the same execution times and burst
                        characteristics. I then compared their average wait
                        times and burst times to assess the impact of the
                        learned scheduling policy. The results are shown below.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/RLSched/RL-CFS-Wait.png"
                            style={{ width: "70%" }}
                        />
                        <i>
                            Adaptive Scheduler vs Stock CFS Scheduler wait times
                        </i>
                    </div>
                    <p>
                        The graphs above show the wait-time distributions for
                        the stock CFS scheduler and the adaptive RL-based
                        scheduler under identical workloads. The adaptive
                        scheduler consistently maintains lower average wait
                        times, with individual task wait times remaining within
                        a narrow range. In contrast, the stock CFS scheduler
                        exhibits significantly higher variance, with pronounced
                        spikes indicating extreme wait times for certain tasks.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/RLSched/RL-CFS-TAT.png"
                            style={{ width: "70%" }}
                        />
                        <i>
                            Adaptive Scheduler vs Stock CFS Scheduler turnaround
                            times
                        </i>
                    </div>
                    <p>
                        This graph shows the average turnaround time across the
                        ten workloads evaluated. The adaptive scheduler
                        outperforms the stock CFS scheduler in seven out of ten
                        cases, indicating a consistent improvement in scheduling
                        decisions under these workloads.
                    </p>
                    <h2>Kernel Policy Integration</h2>
                    <p>
                        Now that a working and trained policy is in place, the
                        next step is to integrate it into the Linux kernel.
                        However, this task is far from straightforward. In
                        userspace, training and experimentation benefited from
                        high-level tools such as Python, NumPy, and various
                        machine learning libraries, which make implementing and
                        iterating on neural network policies relatively easy. In
                        contrast, deploying the same policy inside the kernel
                        requires reimplementing it in C under strict resource
                        and performance constraints.
                    </p>
                    <p>
                        The first and most significant constraint was the lack
                        of floating-point support in kernel space, unless
                        floating-point registers are explicitly saved and
                        restored, an approach that is both complex and costly.
                        To address this, I adopted a Q-format fixed-point
                        representation, where a fixed number of bits encode the
                        integer portion of a value and the remaining bits
                        represent the fractional component. However, this change
                        introduced additional complexity, as all arithmetic
                        operations, including multiplication and addition, had
                        to be reimplemented to correctly support the chosen
                        fixed-point format.
                    </p>
                    <p>
                        I began by converting all of the trained weights and
                        biases for the policy neural net to Qn.32. However, I
                        think the level of precision for Qn.32 might have been
                        an overkill. After this, I had to implement matrix
                        multiplication, tanh, softmax and other helper functions
                        for Qn.32 in C. The codes for which can be found below:
                    </p>
                    <div className="code-block">
                        <h3>
                            C code to convert to Qn.32 (Q32.32 in particular)
                        </h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {`static inline q32_32 q32_from_int(s64 x){
    __int128 t = (__int128)x << Q; return (q32_32)sat_s64(t); 
}`}
                        </Prism>
                    </div>
                    <div className="code-block">
                        <h3>Matrix Multiplication</h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {matrix_multiply_code}
                        </Prism>
                    </div>
                    <div className="code-block">
                        <h3>Tanh calculation</h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {tanh_code}
                        </Prism>
                    </div>
                    <div className="code-block">
                        <h3>Softmax Calculation</h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {softmax_code}
                        </Prism>
                    </div>
                    <div className="code-block">
                        <h3>Forward Pass Neural Net Policy</h3>
                        <Prism language="c" style={coldarkDark} showLineNumbers>
                            {forward_policy}
                        </Prism>
                    </div>
                    <p>
                        Each forward pass of the policy network takes
                        approximately 15 µs. If an RL decision were made every
                        time a task was enqueued, this overhead would accumulate
                        quickly and significantly impact scheduling latency. To
                        mitigate this cost, I chose to evaluate the policy for
                        each task at most once every 1 ms. As a result, a task
                        retains the same time slice for the duration of this 1
                        ms window, regardless of how many times it is enqueued,
                        and is assigned a new slice only when the interval
                        expires.
                    </p>
                    <h2>Results</h2>
                    <p>
                        After successfully integrating the policy into the Linux
                        kernel and resolving numerous implementation issues, I
                        was able to run the adaptive scheduler stably in kernel
                        space. I then evaluated the adaptive scheduler alongside
                        the stock CFS scheduler using identical workloads. The
                        following table summarizes the observed results.
                    </p>
                    <div className="article-table-block">
                        <table>
                            <thead>
                                <tr>
                                    <th>Scheduler Type</th>
                                    <th>Average Burst Time</th>
                                    <th>Average Wait time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Stock CFS</td>
                                    <td>0.385 ms</td>
                                    <td>11.06 ms</td>
                                </tr>
                                <tr>
                                    <td>RL Scheduler</td>
                                    <td>0.419 ms</td>
                                    <td>13.43 ms</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        While the adaptive scheduler exhibits a slightly higher
                        average wait time compared to stock CFS, this behavior
                        is consistent with the reward formulation used during
                        training. The reward function explicitly balances wait
                        time reduction against longer burst execution and fewer
                        context switches, prioritizing overall scheduling
                        efficiency rather than minimizing wait time alone. As a
                        result, the adaptive scheduler accepts a modest increase
                        in wait time in exchange for improved burst behavior and
                        reduced context-switch overhead.
                    </p>
                    <h2>Conclusion</h2>
                    <p>
                        Although the adaptive scheduler produced encouraging
                        results, there remains significant potential for further
                        optimization. In particular, training the policy
                        directly within the kernel, rather than relying on an
                        external simulator, could allow the agent to better
                        capture real-world scheduling dynamics and hardware
                        effects. Overall, this project deepened my understanding
                        of how learning-based algorithms can be integrated into
                        low-level systems such as the Linux kernel. Looking
                        ahead, similar techniques could be extended to implement
                        more aggressive scheduling policies, such as shortest
                        job first (SJF) by appropriately redefining the reward
                        function and adjusting the policy architecture to suit
                        specific use cases.
                    </p>
                </div>
            </div>
        </MathJaxProvider>
    );
}
