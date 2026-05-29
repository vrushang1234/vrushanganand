const discover_memory = `fn entry_type_name(entry_type: EntryType) -> &'static str {
    match entry_type {
        EntryType::USABLE => "Usable",
        EntryType::RESERVED => "Reserved",
        EntryType::ACPI_RECLAIMABLE => "ACPI Reclaimable",
        EntryType::ACPI_NVS => "ACPI NVS",
        EntryType::BAD_MEMORY => "Bad Memory",
        EntryType::BOOTLOADER_RECLAIMABLE => "Bootloader Reclaimable",
        EntryType::KERNEL_AND_MODULES => "Kernel and Modules",
        EntryType::FRAMEBUFFER => "Framebuffer",
        _ => "Unknown",
    }
}

pub fn print_memory() {
    let Some(response) = MEMMAP_REQUEST.get_response() else {
        framebuffer::print("No memory map\\n", 0xFFFFFFFF);
        return;
    };

    let mut writer = FbWriter;
    for entry in response.entries() {
        let _ = write!(
            writer,
            "base={:#x}, len={:#x}, kind={}\\n",
            entry.base,
            entry.length,
            entry_type_name(entry.entry_type)
        );
    }
}
`;

export default discover_memory;
