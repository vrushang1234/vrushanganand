const paging_translate = `pub unsafe fn translate(pml4: *mut PageTable, virt: VirtAddr) -> Option<u64> {
    let pml4_e = (*pml4).entries[virt.pml4_index()];
    let pdpt = next_table(pml4_e)?;
    let pdpt_e = (*pdpt).entries[virt.pdpt_index()];

    if pdpt_e.flags() & flags::HUGE != 0 {
        return Some(pdpt_e.addr() + (virt.0 & 0x3FFF_FFFF));
    }
    let pd = next_table(pdpt_e)?;
    let pd_e = (*pd).entries[virt.pd_index()];

    if pd_e.flags() & flags::HUGE != 0 {
        return Some(pd_e.addr() + (virt.0 & 0x1F_FFFF));
    }
    let pt = next_table(pd_e)?;
    let pt_e = (*pt).entries[virt.pt_index()];
    if !pt_e.is_present() {
        return None;
    }
    Some(pt_e.addr() + virt.page_offset())
}
`;

export default paging_translate;
