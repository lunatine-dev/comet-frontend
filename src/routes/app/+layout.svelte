<script>
    import Navbar from "$lib/components/Nav/Navbar.svelte";

    let { children, data } = $props();
</script>

<Navbar user={data.user} />

<div class="flex flex-col h-full w-full justify-between pb-5 pt-5">
    <div class="container m-auto min-h-[60vh] w-full flex flex-col p-[0 2rem]">
        {@render children?.()}
    </div>
</div>
