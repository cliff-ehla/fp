<script>
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let label = '';
    export let options = []; // array of { id, label }
    export let selectedIds = [];
    
    let dropdownOpen = false;

    // Filter out already selected options
    $: availableOptions = options.filter(opt => !selectedIds.includes(opt.id));
    
    // Map selected IDs back to option objects for rendering the selected list
    $: selectedOptions = selectedIds.map(id => options.find(opt => opt.id === id)).filter(Boolean);

    function toggleDropdown() {
        dropdownOpen = !dropdownOpen;
    }

    function selectOption(id) {
        selectedIds = [...selectedIds, id];
        dropdownOpen = false;
        dispatch('change', selectedIds);
    }

    function removeOption(id) {
        selectedIds = selectedIds.filter(selectedId => selectedId !== id);
        dispatch('change', selectedIds);
    }
</script>

<div class="mb-6">
    <label class="block text-xs font-bold text-gray-400 uppercase mb-2">
        {label} {#if selectedIds.length > 0}({selectedIds.length}){/if}
    </label>
    
    <div class="relative mb-3">
        <!-- Dropdown trigger -->
        <button 
            type="button" 
            on:click={toggleDropdown}
            class="w-full flex items-center justify-between bg-[#32324d] text-gray-300 border border-[#4a4a6a] rounded p-3 text-sm focus:border-[#7b79ff] focus:ring-1 focus:ring-[#7b79ff] outline-none transition"
        >
            <span>Add relation</span>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </button>

        <!-- Dropdown menu -->
        {#if dropdownOpen}
            <!-- Click outside backdrop -->
            <div class="fixed inset-0 z-10" on:click={() => dropdownOpen = false}></div>
            
            <div class="absolute z-20 w-full mt-1 bg-[#212134] border border-[#4a4a6a] rounded shadow-lg max-h-60 overflow-y-auto py-1">
                {#if availableOptions.length === 0}
                    <div class="px-4 py-2 text-sm text-gray-500">No options available</div>
                {:else}
                    {#each availableOptions as option}
                        <button 
                            type="button" 
                            on:click={() => selectOption(option.id)}
                            class="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-[#32324d] transition"
                        >
                            {option.label}
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
                <div class="flex items-center gap-3">
                    <div class="cursor-grab text-gray-500 group-hover:text-gray-300 transition-colors">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                            <circle cx="6" cy="4" r="1.5"></circle>
                            <circle cx="6" cy="8" r="1.5"></circle>
                            <circle cx="6" cy="12" r="1.5"></circle>
                            <circle cx="10" cy="4" r="1.5"></circle>
                            <circle cx="10" cy="8" r="1.5"></circle>
                            <circle cx="10" cy="12" r="1.5"></circle>
                        </svg>
                    </div>
                    <span class="text-[#7b79ff] text-sm font-medium">{option.label}</span>
                </div>
                <button 
                    type="button" 
                    on:click={() => removeOption(option.id)}
                    class="text-gray-500 hover:text-gray-300 transition"
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
