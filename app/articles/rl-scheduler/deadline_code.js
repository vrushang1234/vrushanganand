const deadline_code = `void update_curr(struct cfs_rq *rq)
{
    // Current running task
    struct sched_entity *task = rq->curr;

    if (!task)
        return;

    // Time the task just ran 
    u64 delta_exec = get_execution_time(task);
    if (delta_exec == 0)
        return;

    // Advance virtual runtime based on priority 
    task->vruntime += (delta_exec * NICE_0_LOAD) / task->load.weight;

    // Recompute the task's virtual deadline 
    task->deadline = task->vruntime + task->slice;

    // Advance the runqueue's minimum vruntime 
    rq->min_vruntime = min(rq->min_vruntime, task->vruntime);

    // Preempt if another task now has an earlier deadline 
    if (task->deadline > next_earliest_deadline(rq))
        schedule_next_task();
}

static inline u64 calc_delta_fair(u64 delta_exec, struct sched_entity *se)
{
    u64 task_weight = se->load.weight;

    /* If task has default priority, no scaling is needed */
    if (task_weight == NICE_0_LOAD)
        return delta_exec;

    /* Scale execution time based on task priority */
    return (delta_exec * NICE_0_LOAD) / task_weight;
}
`;
export default deadline_code;
