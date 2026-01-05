import "../indiv-article.css";
import MathJaxProvider from "../mathjaxProvider";

import { Prism } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import vruntime_code from "./vruntime_code";
import deadline_code from "./deadline_code";

export default function RlScheduler() {
    return (
        <MathJaxProvider>
            <div className="indiv-article">
                <h1>RL Kernel Scheduler</h1>
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
                    <h2>What exactly is a scheduler tho?</h2>
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
                        <Prism language="c" style={atomDark} showLineNumbers>
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

                    <div>
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
                        least the default slice duration (700,000 µs). At this
                        point, the current state of the CPU while running this
                        task is stored in a struct and a new task is scheduled
                        to run.
                    </p>
                    <div className="code-block">
                        <h3>
                            Oversimplified version of kernel code to calculate
                            deadline and preempt
                        </h3>
                        <Prism language="c" style={atomDark} showLineNumbers>
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

                    <div>
                        {
                            "$$\\text{deadline} = \\text{vruntime} + \\text{slice} \\cdot \\frac{\\text{NICE\_0\_WEIGHT}}{\\text{task\_weight}}$$"
                        }
                    </div>

                    <p>
                        In the current design, the slice term is the same for
                        every task and is set to 700,000 µs by default. Rather
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
                        default task time slice of 700,000 µs. Hence, the action
                        space starts at 70,000 µs (one tenth of the default) to
                        enable shorter execution windows and lower virtual
                        deadlines for latency-sensitive tasks, and extends to
                        1,120,000 µs in increments of 105,000 µs. The policy
                        outputs a discrete probability distribution over these
                        slice values, from which a slice is sampled and assigned
                        to the task at each scheduling decision.
                    </p>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {`
                            $$
                            s_t =
                            \\begin{bmatrix}
                            w^{(t)}_{\\text{last}} \\\\
                            w^{(t)}_{\\text{avg}} \\\\
                            b^{(t)}_{\\text{last}} \\\\
                            b^{(t)}_{\\text{avg}} \\\\
                            \\bar{w}_{\\text{rq}} \\\\
                            \\bar{b}_{\\text{rq}}
                            \\end{bmatrix}
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
                </div>
            </div>
        </MathJaxProvider>
    );
}
