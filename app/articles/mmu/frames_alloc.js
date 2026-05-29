const frames_alloc = `pub fn alloc_frame() -> Option<u64> {
    unsafe {
        if FREE_LIST_HEAD == 0 {
            return None;
        }
        let addr = FREE_LIST_HEAD;
        let next = *(phys_to_virt(addr) as *const u64);
        FREE_LIST_HEAD = next;
        Some(addr)
    }
}

pub fn free_frame(addr: u64) {
    debug_assert!(addr & (FRAME_SIZE - 1) == 0);
    unsafe {
        *(phys_to_virt(addr) as *mut u64) = FREE_LIST_HEAD;
        FREE_LIST_HEAD = addr;
    }
}
`;

export default frames_alloc;
