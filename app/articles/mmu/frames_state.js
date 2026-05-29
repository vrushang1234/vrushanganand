const frames_state = `pub const FRAME_SIZE: u64 = 4096;

#[derive(Copy, Clone)]
pub struct MemRegion {
    pub base: u64,
    pub length: u64,
    pub frames: u64,
}

const MAX_REGIONS: usize = 64;
static mut USABLE_REGIONS: [MemRegion; MAX_REGIONS] = [MemRegion {
    base: 0,
    length: 0,
    frames: 0,
}; MAX_REGIONS];
static mut USABLE_COUNT: usize = 0;
static mut TOTAL_FRAMES: u64 = 0;

static mut FREE_LIST_HEAD: u64 = 0;
`;

export default frames_state;
