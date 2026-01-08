const forward_policy = `void forward(const q32_32 input[INPUT_SIZE]) {
    nn_gemm_q32(&W1[0][0], input, B1, A1, HIDDEN_LAYER_1_SIZE, INPUT_SIZE);
    nn_tanh_q32(A1, HIDDEN_LAYER_1_SIZE);
    nn_gemm_q32(&W2[0][0], A1, B2, A2, HIDDEN_LAYER_2_SIZE, HIDDEN_LAYER_1_SIZE);
    nn_tanh_q32(A2, HIDDEN_LAYER_2_SIZE);
    nn_gemm_q32(&W3[0][0], A2, B3, NN_OUTPUT, OUTPUT_SIZE, HIDDEN_LAYER_2_SIZE);
}
`;

export default forward_policy;
