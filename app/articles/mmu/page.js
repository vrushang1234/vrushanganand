import "../indiv-article.css";
import MathJaxProvider from "../mathjaxProvider";

import { Prism } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import discover_memory from "./discover_memory";
import frames_state from "./frames_state";
import frames_init from "./frames_init";
import frames_alloc from "./frames_alloc";
import paging_entry from "./paging_entry";
import paging_vaddr from "./paging_vaddr";
import paging_map from "./paging_map";
import paging_translate from "./paging_translate";

export default function Mmu() {
    return (
        <MathJaxProvider>
            <div className="indiv-article">
                <a className="overlay-btn-close" href="/articles">
                    &lt; Back
                </a>
                <h1>Memory Management in OS</h1>
                <div className="article-body">
                    <p>
                        What actually happens internally when we initialize
                        variables in our code? How does our system deal with all
                        of this memory under the hood? I am building my own
                        operating system called vishyOS, and recently I have
                        been working on memory management. In this article, I
                        want to break down what happens under the hood when
                        programs use memory.
                    </p>
                    <h2>What is Memory Management Unit?</h2>
                    <p>
                        Whenever a process runs, it “lives” in RAM. The RAM
                        stores all the variables, pointers, arrays, and other
                        data used by the program. However, RAM itself is just a
                        large collection of bytes. The CPU needs a way to know
                        where each piece of data is stored and how to access it
                        efficiently.
                    </p>
                    <p>
                        This is where the Memory Management Unit (MMU) comes
                        into play. Think of RAM as a hotel, and the process data
                        as the guests. The MMU acts like the receptionist,
                        deciding which room each guest stays in and keeping
                        track of where everyone is located. When a program tries
                        to access memory, the MMU helps the CPU find the correct
                        location in RAM where that data is stored.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/MMU/hotel_reception.png"
                            style={{ width: "60%" }}
                        />
                        <i>Source: &nbsp;AI Generated Image</i>
                    </div>
                    <h2>Discover Usable Memory</h2>
                    <p>
                        Not all memory in RAM is actually usable by the
                        operating system. Some regions are already reserved for
                        things such as the bootloader, BIOS/UEFI internals,
                        power management systems, the framebuffer, and other
                        hardware-related components. If the OS accidentally
                        overwrites these regions, the system can become unstable
                        or crash entirely.
                    </p>
                    <p>
                        Before the OS can manage memory, it first needs to
                        understand what memory exists and which regions are safe
                        to use. This information is provided through a memory
                        map passed by the bootloader during startup. The kernel
                        can then traverse through this memory map and filter out
                        the unusable regions, keeping only the regions marked as
                        available.
                    </p>
                    <p>
                        Below is an example of traversing through the memory map
                        and printing the type of each memory region in vishyOS:
                    </p>
                    <div className="code-block">
                        <h3>vishyOS memory map traversal</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {discover_memory}
                        </Prism>
                    </div>
                    <p>
                        The bootloader (Limine in this case) hands the kernel a
                        memory map through <code>MEMMAP_REQUEST</code>.{" "}
                        <code>print_memory</code> grabs that response, then
                        iterates every entry the bootloader reported. For each
                        region it prints the base address, length, and region
                        kind (Usable, Reserved, ACPI, Framebuffer, etc.) to the
                        framebuffer. If the bootloader returns no response, the
                        kernel bails out early with an error message. This is
                        the first step before any allocator can run since the
                        kernel must know which regions are safe to touch.
                    </p>
                    <p>
                        Knowing that a region is usable is only half the
                        problem. The operating system still needs an efficient
                        way to organize and allocate that memory.
                    </p>
                    <h2>Frames</h2>
                    <p>
                        Let’s go back to the previous hotel analogy. Imagine if,
                        instead of having fixed-size rooms, the hotel created
                        differently sized rooms for every guest depending on
                        their exact needs. Managing the hotel would quickly
                        become extremely complicated because every allocation
                        would be different, and over time the remaining free
                        space would become fragmented and difficult to reuse
                        efficiently.
                    </p>
                    <p>
                        Memory management has a similar problem. Giving every
                        process an arbitrary chunk of raw memory would be
                        difficult to track and manage efficiently. To simplify
                        this, the operating system divides physical memory into
                        fixed-size blocks called frames. On most modern systems,
                        a frame is typically 4 KB (4096 bytes) in size.
                    </p>
                    <p>
                        Because memory is divided into fixed-size frames, the OS
                        no longer needs to think in terms of arbitrary byte
                        ranges. Instead of saying, “Give me 20480 bytes,” it can
                        simply say, “Reserve 5 frames.” This makes memory
                        allocation, tracking, and protection significantly
                        easier.
                    </p>
                    <p>
                        Below is a simple implementation of frames in vishyOS.
                        First, we define the frame size, a small struct to
                        describe each usable region, and the static state the
                        allocator will maintain:
                    </p>
                    <div className="code-block">
                        <h3>Frame state</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {frames_state}
                        </Prism>
                    </div>
                    <p>
                        <code>FRAME_SIZE</code> is fixed at 4096 bytes.{" "}
                        <code>MemRegion</code> records the base, length, and
                        frame count of a single usable region.{" "}
                        <code>USABLE_REGIONS</code> is a fixed-capacity array
                        (cap 64) holding every usable region the bootloader
                        reported, and <code>TOTAL_FRAMES</code> tracks the
                        global count.<code> FREE_LIST_HEAD</code> is the head
                        pointer of an intrusive free-list, which we use to
                        allocate frames in O(1) time complexity instead of
                        scanning a bitmap.
                    </p>
                    <p>
                        Next, we walk the bootloader memory map, keep only
                        usable entries, and carve them into frame-sized chunks:
                    </p>
                    <div className="code-block">
                        <h3>Carving regions into frames</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {frames_init}
                        </Prism>
                    </div>
                    <p>
                        Each usable region's base is rounded up to the next 4 KB
                        boundary and its end rounded down, so every frame sits
                        on an aligned address. If the rounding collapses the
                        region (it was smaller than a frame, or misaligned), we
                        skip it. The aligned length divided by{" "}
                        <code>FRAME_SIZE</code> gives the number of frames the
                        region contributes, which we store in{" "}
                        <code>USABLE_REGIONS</code> and add to the running{" "}
                        <code>total_frames</code> counter.
                    </p>
                    <p>
                        Once the regions are known, every frame is pushed onto
                        the free list. Allocation and freeing then become a
                        single pointer swap:
                    </p>
                    <div className="code-block">
                        <h3>Allocating and freeing frames</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {frames_alloc}
                        </Prism>
                    </div>
                    <p>
                        Free frames are not tracked in a separate structure.
                        Instead, the first 8 bytes of each free frame store a
                        pointer to the next free frame, forming a LIFO linked
                        list with no extra memory overhead.{" "}
                        <code>alloc_frame</code> pops the head and returns its
                        physical address. <code>free_frame</code> writes the old
                        head into the frame being released and makes that frame
                        the new head. The <code>phys_to_virt</code> call is
                        needed because the kernel runs in the higher half, so it
                        must reach the frame through the HHDM (Higher Half
                        Direct Map) offset rather than the raw physical address.
                    </p>
                    <h2>Virtual Memory</h2>
                    <p>
                        At this point we have a working memory allocator. The
                        kernel can discover usable memory, divide it into
                        frames, and allocate those frames on demand. However,
                        exposing physical memory directly to applications would
                        create several problems. Programs could accidentally
                        overwrite each other's data, memory would become
                        increasingly fragmented over time, and applications
                        would need to know the exact physical locations where
                        their data resides. Modern operating systems solve these
                        issues by introducing an additional layer of abstraction
                        between programs and physical memory: virtual
                        memory.{" "}
                    </p>

                    <p>
                        Virtual memory is a technique in which programs work
                        with virtual addresses rather than accessing physical
                        memory directly. These virtual addresses are translated
                        into physical addresses by the MMU. This abstraction
                        simplifies memory management, isolates processes from
                        one another, and allows the operating system to control
                        how physical memory is used behind the scenes.{" "}
                    </p>
                    <p>
                        Virtual memory also enables processes to use more memory
                        than is physically installed in the system. A program
                        does not need to be fully loaded into RAM at all times.
                        Only the portions that are actively being used need to
                        reside in memory, while less frequently accessed
                        portions can remain in secondary storage such as an SSD
                        or HDD. As different parts of the program are needed,
                        the operating system can move data between storage and
                        RAM, allowing processes to use more memory than the
                        physical RAM available on the machine. This mechanism is
                        known as memory swapping.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/MMU/virtual_memory.jpg"
                            style={{ width: "60%" }}
                        />
                        <i>
                            Credits: &nbsp;
                            <a
                                href="https://cs.uic.edu/"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                CS Department at University of Illinois Chicago
                            </a>
                        </i>
                    </div>
                    <p>
                        This layer of indirection allows different processes to
                        use the same virtual addresses without interfering with
                        one another. For example, Process A and Process B may
                        both store data at virtual address 0x1000, yet those
                        addresses can map to completely different physical
                        frames. From the perspective of each process, it appears
                        to own its own private memory space even though the
                        underlying physical memory is shared. As a result,
                        processes remain isolated from one another and cannot
                        accidentally overwrite each other's data.
                    </p>
                    <h2>Paging</h2>
                    <p>
                        Similar to physical memory using frames, virtual memory
                        is divided into fixed-sized blocks called pages. On most
                        systems, they are typically 4 KB in size. This
                        fixed-size structure greatly simplifies memory
                        management. Instead of tracking arbitrary ranges of
                        bytes, the operating system only needs to keep track of
                        which virtual pages are mapped to which physical frames.
                    </p>
                    <p>
                        These pages do not need to be stored in contiguous
                        physical memory. The operating system might map them to
                        completely different physical frames:
                    </p>
                    <ul>
                        <li>Virtual Page 0 {"->"} Physical Frame 42</li>
                        <li>Virtual Page 1 {"->"} Physical Frame 900</li>
                        <li>Virtual Page 2 {"->"} Physical Frame 15</li>
                    </ul>
                    <p>
                        From the program's perspective, memory still appears as
                        one continuous address space. Behind the scenes, the MMU
                        uses these mappings to determine where the data is
                        actually located in physical memory.
                    </p>
                    <p>
                        Now that we have pages and frames, we need a way to keep
                        track of how they are related. This is the job of a page
                        table.
                    </p>
                    <p>
                        A page table is a data structure maintained by the
                        operating system that stores the mapping between virtual
                        pages and physical frames. Whenever a program accesses a
                        virtual address, the MMU consults the page table to
                        determine which physical frame contains the requested
                        data.
                    </p>
                    <p>
                        For example, suppose a process has the following page
                        table:
                    </p>
                    <div className="article-table-block">
                        <table>
                            <thead>
                                <tr>
                                    <th>Virtual Page</th>
                                    <th>Physical Frame</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>0</td>
                                    <td>42</td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>900</td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>15</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        When the program accesses an address that belongs to
                        Virtual Page 1, the MMU looks up Page 1 in the page
                        table and discovers that it is mapped to Physical Frame
                        900. The MMU can then calculate the final physical
                        address and access the correct location in RAM. Below I
                        will explain the implementation of Paging in vishyOS.
                    </p>
                    <p>
                        On x86_64, virtual addresses are 48 bits and the page
                        table is a 4-level tree: PML4 {"->"} PDPT {"->"} PD
                        {"->"} PT. Every level has the same shape, 512 entries
                        of 8 bytes each, which is exactly one 4 KB frame. We
                        start by defining a single entry, the flag bits the CPU
                        recognizes, and the table itself:
                    </p>
                    <div className="code-block">
                        <h3>Page table entry and table layout</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {paging_entry}
                        </Prism>
                    </div>
                    <p>
                        An <code>Entry</code> packs both a physical address and
                        flag bits into a single 64-bit value. The low 12 bits
                        and the highest bit carry the flags such as{" "}
                        <code>PRESENT</code>, <code>WRITABLE</code>, and{" "}
                        <code>NO_EXECUTE</code>; the middle bits hold the
                        physical address of the next-level table (or of the
                        target frame, at the leaf). <code>ADDR_MASK</code>{" "}
                        isolates the address bits.{" "}
                        <code>#[repr(C, align(4096))]</code> guarantees a{" "}
                        <code>PageTable</code> is itself a single frame, which
                        is required by the CPU.
                    </p>
                    <p>
                        Each level of the tree is indexed by a different 9-bit
                        slice of the virtual address. The bottom 12 bits are the
                        byte offset inside the final frame:
                    </p>
                    <div className="code-block">
                        <h3>Splitting a virtual address into level indices</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {paging_vaddr}
                        </Prism>
                    </div>
                    <p>
                        Bits 39-47 index the PML4, 30-38 the PDPT, 21-29 the PD,
                        and 12-20 the PT. Nine bits each = 512 entries per
                        table, matching <code>ENTRY_COUNT</code>. The low 12
                        bits (<code>page_offset</code>) are added to the leaf
                        frame address to produce the final physical address.
                    </p>
                    <p>
                        Mapping a virtual page to a physical frame means walking
                        these four levels and creating any missing tables along
                        the way:
                    </p>
                    <div className="code-block">
                        <h3>Mapping a page</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {paging_map}
                        </Prism>
                    </div>
                    <p>
                        <code>next_table_create</code> returns the next-level
                        table if it exists, otherwise allocates a fresh frame
                        with the frame allocator, zeros it, and installs it in
                        the parent entry as <code>PRESENT | WRITABLE</code>.{" "}
                        <code>map_page</code> chains three of these calls to
                        reach the leaf PT, refuses to overwrite an existing
                        mapping, and writes the final entry with the caller's
                        flags. <code>invlpg</code> flushes the TLB for that
                        single virtual address so the CPU does not keep serving
                        a stale translation.
                    </p>
                    <p>
                        Translation is the same walk in reverse. Given a virtual
                        address, we follow the levels and return the physical
                        address it maps to:
                    </p>
                    <div className="code-block">
                        <h3>Translating a virtual address</h3>
                        <Prism
                            language="rust"
                            style={coldarkDark}
                            showLineNumbers
                        >
                            {paging_translate}
                        </Prism>
                    </div>
                    <p>
                        At each level, if an entry is missing we return{" "}
                        <code>None</code>. The extra <code>HUGE</code> checks
                        handle 1 GiB pages (at the PDPT) and 2 MiB pages (at the
                        PD), where the walk stops early and the leftover low
                        bits of the virtual address become the offset inside the
                        huge frame. Otherwise we descend all the way to the PT
                        and add <code>page_offset</code> to the leaf frame
                        address. This is the same operation the MMU performs in
                        hardware on every memory access.
                    </p>
                    <div className="article-img-div">
                        <img
                            src="/assets/Pictures/Articles/MMU/paging_example.png"
                            style={{ width: "50%" }}
                        />
                        <i>Source: &nbsp;vishyOS Screenshot</i>
                    </div>
                    <p>
                        We can look at an example of virtual address
                        0xffff800012345678. It is split into four 9-bit indices
                        and a 12-bit page offset. The MMU first looks at entry
                        256 in the PML4, then entry 0 in the PDPT, followed by
                        entry 145 in the PD, and entry 325 in the PT. The final
                        page-table entry contains the physical frame backing
                        this virtual page. The offset (1656 bytes) is then added
                        to the frame's base address to produce the final
                        physical address.
                    </p>
                    <h2>Conclusion</h2>
                    <p>
                        Starting from a raw memory map provided by the
                        bootloader, we discovered usable memory, divided it into
                        frames, built a frame allocator, created page tables,
                        and mapped virtual pages to physical frames. Together,
                        these components create the illusion that every process
                        owns its own continuous address space while allowing the
                        operating system to efficiently share and manage
                        physical memory.
                    </p>
                    <p>
                        While vishyOS currently implements only the foundations
                        of memory management, these foundations are what enable
                        more advanced features such as page faults, demand
                        paging, process isolation, and memory swapping. Those
                        will be the next steps as the memory subsystem continues
                        to evolve.
                    </p>
                    <h2>Link to Github Repository</h2>
                    <ul className="repo-links">
                        <li>
                            <a
                                href="https://github.com/vrushang1234/vishyOS"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img src="/assets/Pictures/Articles/github-svg.svg" />
                                <span>vishyOS</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </MathJaxProvider>
    );
}
