const paging_map = `unsafe fn next_table_create(e: &mut Entry) -> Result<*mut PageTable, MapError> {
    if e.is_present() {
        Ok(table_ptr(e.addr()))
    } else {
        let phys = alloc_table().ok_or(MapError::OutOfFrames)?;
        e.set(phys, flags::PRESENT | flags::WRITABLE);
        Ok(table_ptr(phys))
    }
}

pub unsafe fn map_page(
    pml4: *mut PageTable,
    virt: VirtAddr,
    phys: u64,
    leaf_flags: u64,
) -> Result<(), MapError> {
    let pml4_e = &mut (*pml4).entries[virt.pml4_index()];
    let pdpt = next_table_create(pml4_e)?;

    let pdpt_e = &mut (*pdpt).entries[virt.pdpt_index()];
    let pd = next_table_create(pdpt_e)?;

    let pd_e = &mut (*pd).entries[virt.pd_index()];
    let pt = next_table_create(pd_e)?;

    let pt_e = &mut (*pt).entries[virt.pt_index()];
    if pt_e.is_present() {
        return Err(MapError::AlreadyMapped);
    }
    pt_e.set(phys, leaf_flags | flags::PRESENT);

    invlpg(virt.0);
    Ok(())
}
`;

export default paging_map;
