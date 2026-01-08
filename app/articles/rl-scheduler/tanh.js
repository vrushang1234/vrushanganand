const tanh_code = `#define ONE_Q ((q32_32)1 << Q)

void nn_tanh_q32(q32_32 *v, int n) {
    for (int i = 0; i < n; i++) {
        s64 x = v[i];
        if (x > (s64)(4 * ONE_Q)) v[i] = ONE_Q;
        else if (x < (s64)(-4 * ONE_Q)) v[i] = -ONE_Q;
        else {
            s64 x2 = qmul_q32_32((q32_32)x, (q32_32)x);
            s64 num = x * ((s64)27 * ONE_Q + x2);
            s64 den = ((s64)27 * ONE_Q) + (3 * x2);
            v[i] = (q32_32)(num / den);
        }
    }
}`;

export default tanh_code;
