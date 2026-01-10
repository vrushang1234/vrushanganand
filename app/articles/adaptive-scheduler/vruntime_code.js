const vruntime_code = `static void update_min_vruntime(struct cfs_rq *cfs_rq)
{
    struct sched_entity *se = __pick_root_entity(cfs_rq); // Lowest vruntime task
    struct sched_entity *curr = cfs_rq->curr;             // Currently running task

    u64 vruntime = cfs_rq->min_vruntime;

    // Compare against the smallest vruntime entity
    if (se) {
        if (!curr)
            vruntime = se->min_vruntime;
        else
            vruntime = min_vruntime(vruntime, se->min_vruntime);
    }

    u64 new_min_vruntime = cfs_rq->min_vruntime;
    s64 delta = (s64)(vruntime - new_min_vruntime);

    if (delta > 0) {
        avg_vruntime_update(cfs_rq, delta);
        cfs_rq->min_vruntime = vruntime;
    }
}
`;

export default vruntime_code;
