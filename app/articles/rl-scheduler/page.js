import "../indiv-article.css";
export default function RlScheduler() {
    return (
        <div className="indiv-article">
            <h1>RL Kernel Scheduler</h1>
            <div className="article-body">
                <p>
                    Linux schedulers are built on carefully tuned heuristics.
                    However, they are static and apply the same workload across
                    all workloads. Modern systems run a wide range of workloads,
                    from latency-sensitive tasks to long and heavy workloads. A
                    single, fixed scheduling policy cannot optimally serve all
                    of these use cases. Sometimes, this leads to high latency or
                    unfair resource allocation under certain workloads. My goal
                    was to move beyond this limitation by enabling the scheduler
                    to learn from runtime behavior.
                </p>
                <h2>What exactly is a scheduler tho?</h2>
                <p>
                    A process scheduler in an operating system decides which
                    process to run next. Yet my computer appears to run Spotify,
                    Valorant, and 20 Chrome tabs all at the same time. If that’s
                    the case, why do we need a scheduler at all? The answer lies
                    in how modern CPUs share time among competing processes.
                    Even on multi-core systems, resources are finite, and the
                    scheduler must constantly decide who gets the CPU and for
                    how long.
                </p>
                <p>
                    You can think of this process as a game of
                    <i> "Overcooked"</i>, where each incoming task is a new
                    order and each player represents a CPU core. Despite having
                    only a limited number of players, the kitchen can handle a
                    large number of orders through proper scheduling, deciding
                    what each player should work on at the right time so that no
                    customer waits too long. In the same way, a scheduler must
                    ensure that all tasks in the queue are completed before
                    their deadlines expire.
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
            </div>
        </div>
    );
}
