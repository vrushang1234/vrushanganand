const frames_init = `for entry in response
    .entries()
    .iter()
    .filter(|e| e.entry_type == EntryType::USABLE)
{
    if count >= MAX_REGIONS {
        break;
    }

    let aligned_base = (entry.base + FRAME_SIZE - 1) & !(FRAME_SIZE - 1);
    let end = entry.base + entry.length;
    let aligned_end = end & !(FRAME_SIZE - 1);
    if aligned_end <= aligned_base {
        continue;
    }
    let length = aligned_end - aligned_base;
    let frames = length / FRAME_SIZE;

    unsafe {
        USABLE_REGIONS[count] = MemRegion {
            base: aligned_base,
            length,
            frames,
        };
    }
    total_frames += frames;
    count += 1;
}
`;

export default frames_init;
