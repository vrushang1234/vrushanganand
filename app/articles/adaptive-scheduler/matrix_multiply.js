const matrix_multiply_code = `static inline q32_32 qmul_q32_32(q32_32 a, q32_32 b) {
    __int128 p = (__int128)a * (__int128)b;
    if (p >= 0) p += (__int128)1 << (Q - 1); else p -= (__int128)1 << (Q - 1);
    p >>= Q;
    return (q32_32)sat_s64(p);
}

void nn_gemm_q32(const q32_32 *w, const q32_32 *x, const q32_32 *b, q32_32 *y, int rows, int cols) {
    for (int i = 0; i < rows; i++) {
        __int128 acc = 0;
        const q32_32 *wi = w + (size_t)i * cols;
        for (int j = 0; j < cols; j++) acc += (s64)qmul_q32_32(wi[j], x[j]);
        if (b) acc += b[i];
        y[i] = (q32_32)sat_s64(acc);
    }
}`;

export default matrix_multiply_code;
