const paging_vaddr = `#[derive(Copy, Clone)]
pub struct VirtAddr(pub u64);

impl VirtAddr {
    pub fn pml4_index(self) -> usize { ((self.0 >> 39) & 0x1FF) as usize }
    pub fn pdpt_index(self) -> usize { ((self.0 >> 30) & 0x1FF) as usize }
    pub fn pd_index(self)   -> usize { ((self.0 >> 21) & 0x1FF) as usize }
    pub fn pt_index(self)   -> usize { ((self.0 >> 12) & 0x1FF) as usize }
    pub fn page_offset(self) -> u64  { self.0 & 0xFFF }
}
`;

export default paging_vaddr;
