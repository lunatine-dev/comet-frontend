<script>
    import { get } from "$lib/utils/api.js";
    import { AccordionItem, Accordion, TextPlaceholder } from "flowbite-svelte";
    import { onMount } from "svelte";

    import { GithubSolid, ServerSolid } from "flowbite-svelte-icons";

    let repos = $state(0);
    let managed = $state(0);
    let loading = $state(true);

    let { data } = $props();

    const getRepoCount = async () => {
        const arr = await get("/repos/github/", data.accessToken);

        repos = arr.length || 0;
    };
    const getManagedCount = async () => {
        const arr = await get("/repos/live/", data.accessToken);

        managed = arr.length || 0;
    };

    const fetchData = async () => {
        loading = true;
        await getRepoCount();
        await getManagedCount();
        loading = false;
    };

    onMount(async () => {
        fetchData();
    });
</script>

<div class="flex gap-4 items-center justify-center">
    <article
        class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 w-1/4"
    >
        <span
            class="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        >
            <ServerSolid />
        </span>

        <div>
            {#if !loading}
                <p class="text-2xl font-medium text-gray-900 dark:text-white">
                    {managed}
                </p>
            {:else}
                <div
                    class="w-[25px] h-[30px] rounded-md overflow-hidden shrink-0"
                >
                    <div
                        class="animate-pulse block bg-gray-700 w-full h-full object-cover"
                    ></div>
                </div>
            {/if}

            <p class="text-sm text-gray-500 dark:text-gray-400">
                Managed Repos
            </p>
        </div>
    </article>
    <article
        class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 w-1/4"
    >
        <span
            class="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
        >
            <GithubSolid />
        </span>

        <div>
            {#if !loading}
                <p class="text-2xl font-medium text-gray-900 dark:text-white">
                    {repos}
                </p>
            {:else}
                <div
                    class="w-[25px] h-[30px] rounded-md overflow-hidden shrink-0"
                >
                    <div
                        class="animate-pulse block bg-gray-700 w-full h-full object-cover"
                    ></div>
                </div>
            {/if}

            <p class="text-sm text-gray-500 dark:text-gray-400">Repos</p>
        </div>
    </article>
</div>
