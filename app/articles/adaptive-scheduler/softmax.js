const softmax_code = `static inline q32_32 qexp_q32_32(q32_32 x) {
    const q32_32 MIN_X = -(8 * ONE_Q);
    if (x > 0) x = 0;
    if (x < MIN_X) x = MIN_X;
    q32_32 c1 = ONE_Q, c2 = ONE_Q, c3 = ONE_Q >> 1, c4 = ONE_Q / 6, c5 = ONE_Q / 24, c6 = ONE_Q / 120;
    q32_32 y = c6;
    y = qmul_q32_32(y, x) + c5;
    y = qmul_q32_32(y, x) + c4;
    y = qmul_q32_32(y, x) + c3;
    y = qmul_q32_32(y, x) + c2;
    y = qmul_q32_32(y, x) + c1;
    return y;
}

void nn_softmax_q32(const q32_32 *logits, q32_32 *probs, int n) {
    s64 max = logits[0];
    for (int i = 1; i < n; i++) if (logits[i] > max) max = logits[i];

    q32_32 exps[OUTPUT_SIZE];
    u64 sum = 0;
    for (int i = 0; i < n; i++) {
        q32_32 z = (q32_32)((s64)logits[i] - max);
        q32_32 e = qexp_q32_32(z);
        exps[i] = e;
        sum += (u64)e;
    }
    if (!sum) { /* extremely defensive; should not happen */
        for (int i = 0; i < n; i++) probs[i] = 0;
        return;
    }
    for (int i = 0; i < n; i++) {
        u64 q = mul_u64_u64_div_u64((u64)exps[i], (u64)ONE_Q, (u64)sum);
        probs[i] = (q32_32)(s64)q;
    }
}`;

export default softmax_code;
