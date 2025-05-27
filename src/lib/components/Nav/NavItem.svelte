<script>
    import { NavLi } from "flowbite-svelte";

    /** @type {{href?: string, icon?: any, hideText?: boolean, children?: import('svelte').Snippet}} */
    let { href = "#", icon = null, hideText = false, children } = $props();
</script>

<NavLi
    {href}
    activeClass="text-black dark:text-white active"
    nonActiveClass="text-slate-400 hover:text-black dark:text-gray-400 dark:hover:text-white"
>
    {@const SvelteComponent = icon}
    <div class="flex items-center relative">
        <SvelteComponent />
        <span class="ml-2 {hideText ? 'md:hidden' : ''}"
            >{@render children?.()}</span
        >
    </div>
</NavLi>
