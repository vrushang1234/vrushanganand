const paging_entry = `pub const PAGE_SIZE: u64 = 4096;
pub const ENTRY_COUNT: usize = 512;

pub mod flags {
    pub const PRESENT: u64 = 1 << 0;
    pub const WRITABLE: u64 = 1 << 1;
    pub const USER: u64 = 1 << 2;
    pub const HUGE: u64 = 1 << 7;
    pub const NO_EXECUTE: u64 = 1 << 63;
}

const ADDR_MASK: u64 = 0x000F_FFFF_FFFF_F000;

#[repr(transparent)]
#[derive(Copy, Clone)]
pub struct Entry(pub u64);

impl Entry {
    pub fn is_present(self) -> bool { self.0 & flags::PRESENT != 0 }
    pub fn addr(self) -> u64        { self.0 & ADDR_MASK }
    pub fn flags(self) -> u64       { self.0 & !ADDR_MASK }
    pub fn set(&mut self, addr: u64, flags: u64) {
        self.0 = (addr & ADDR_MASK) | flags;
    }
}

#[repr(C, align(4096))]
pub struct PageTable {
    pub entries: [Entry; ENTRY_COUNT],
}
`;

export default paging_entry;
