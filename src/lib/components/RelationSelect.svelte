<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let label = '';
    export let options = []; // array of { id, label }
    export let selectedIds = [];
    export let multiple = true;
    
    let dropdownOpen = false;
    let searchQuery = '';
    let focusedIndex = -1;

    // Filter out already selected options and filter by search query
    $: availableOptions = options.filter(opt => {
        const notSelected = !selectedIds.includes(opt.id);
        const matchesSearch = opt.label.toLowerCase().includes(searchQuery.toLowerCase());
        return notSelected && matchesSearch;
    });
    
    // Reset focus when options change
    $: {
        availableOptions;
        focusedIndex = -1;
    }
    
    // Map selected IDs back to option objects for rendering the selected list
    $: selectedOptions = selectedIds.map(id => options.find(opt => opt.id === id)).filter(Boolean);

    function openDropdown() {
        dropdownOpen = true;
    }

    function closeDropdown() {
        dropdownOpen = false;
        searchQuery = ''; // Reset search query when closed
    }

    function selectOption(id) {
        if (!multiple) {
            selectedIds = [id];
        } else {
            selectedIds = [...selectedIds, id];
        }
        closeDropdown();
        dispatch('change', selectedIds);
    }

    function removeOption(id) {
        selectedIds = selectedIds.filter(selectedId => selectedId !== id);
        dispatch('change', selectedIds);
    }

    function handleKeydown(event) {
        if (!dropdownOpen && (event.key === 'ArrowDown' || event.key === 'Enter')) {
            openDropdown();
            return;
        }

        if (!dropdownOpen) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (focusedIndex < availableOptions.length - 1) {
                focusedIndex++;
            } else {
                focusedIndex = 0; // loop back to top
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (focusedIndex > 0) {
                focusedIndex--;
            } else {
                focusedIndex = availableOptions.length - 1; // loop back to bottom
            }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (focusedIndex >= 0 && focusedIndex < availableOptions.length) {
                selectOption(availableOptions[focusedIndex].id);
            }
        } else if (event.key === 'Escape') {
            event.preventDefault();
            closeDropdown();
        }
    }
</script>

<div class="mb-6">
    <label class="block text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
        {label} {#if selectedIds.length > 0}({selectedIds.length}){/if}
    </label>
    
    <div class="relative mb-3">
        <!-- Dropdown trigger as an input -->
        <div class="relative">
            <input 
                type="text"
                bind:value={searchQuery}
                on:focus={openDropdown}
                on:keydown={handleKeydown}
                placeholder="Add relation"
                class="w-full bg-[#32324d] text-gray-300 border border-[#4a4a6a] rounded p-3 text-sm focus:border-[#7b79ff] focus:ring-1 focus:ring-[#7b79ff] outline-none transition pr-10"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>

        <!-- Dropdown menu -->
        {#if dropdownOpen}
            <!-- Click outside backdrop -->
            <div class="fixed inset-0 z-10" on:click={closeDropdown}></div>
            
            <div class="absolute z-20 w-full mt-1 bg-[#212134] border border-[#4a4a6a] rounded shadow-lg max-h-60 overflow-y-auto py-1">
                {#if availableOptions.length === 0}
                    <div class="px-4 py-2 text-sm text-gray-500">No options found</div>
                {:else}
                    {#each availableOptions as option, i}
                        <button 
                            type="button" 
                            on:click={() => selectOption(option.id)}
                            class="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-[#32324d] transition flex items-center gap-3 {focusedIndex === i ? 'bg-[#32324d]' : ''}"
                        >
                            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            <span class="truncate">{option.label}</span>
                        </button>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>

    <!-- Selected items list -->
    <div class="space-y-2">
        {#each selectedOptions as option}
            <div class="flex items-center justify-between bg-[#212134] border border-[#4a4a6a] rounded p-3 shadow-sm hover:border-[#7b79ff] transition-colors group">
                <div class="flex items-center gap-3 overflow-hidden">
                    <div class="cursor-grab text-gray-500 group-hover:text-gray-300 transition-colors flex-shrink-0">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="6" cy="4" r="1.5"></circle>
                            <circle cx="6" cy="8" r="1.5"></circle>
                            <circle cx="6" cy="12" r="1.5"></circle>
                            <circle cx="10" cy="4" r="1.5"></circle>
                            <circle cx="10" cy="8" r="1.5"></circle>
                            <circle cx="10" cy="12" r="1.5"></circle>
                        </svg>
                    </div>
                    <span class="text-[#7b79ff] text-sm font-medium truncate">{option.label}</span>
                </div>
                <button 
                    type="button" 
                    on:click={() => removeOption(option.id)}
                    class="text-gray-500 hover:text-gray-300 transition flex-shrink-0 ml-2"
                    title="Remove relation"
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
        {/each}
    </div>
</div>

<style>
    .fixed.inset-0 {
        background: transparent;
    }
</style>
