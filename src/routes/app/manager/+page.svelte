<script>
    import { get, post } from "$lib/utils/api.js";
    import { onMount } from "svelte";
    import { Spinner } from "flowbite-svelte";

    let { data } = $props();
    let loading = $state(true);
    let addingRepo = $state(false);
    let loadingRepos = $state(true);
    let repos = $state([]);
    let githubRepos = $state([]);

    let showAddModal = $state(false);

    async function openModal() {
        showAddModal = true;
        loadingRepos = true;
        try {
            githubRepos = await get("/repos/github", data.accessToken); // replace with your endpoint
        } catch (e) {
            console.error("Failed to load GitHub repos", e);
        }
        loadingRepos = false;
    }

    async function addRepo(repo) {
        addingRepo = true;
        await post(
            `/repos/github/${repo.full_name}/manage`,
            { ...repo },
            data.accessToken
        );
        fetchRepos();
        addingRepo = false;
        closeModal();
    }

    function closeModal() {
        showAddModal = false;
    }

    const fetchRepos = async () => {
        loading = true;
        repos = await get("/repos/live/", data.accessToken);
        loading = false;
    };

    onMount(() => {
        fetchRepos();
    });
</script>

<div class="flex items-center justify-between px-4 pt-4 pb-2">
    <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Managed Repositories
    </h2>
    <button
        class="bg-[#6165ec] hover:bg-[#4e51cc] text-white text-sm px-4 py-2 rounded-lg transition-colors"
        onclick={openModal}
    >
        + Add Repo
    </button>
</div>
{#if loading}
    <div class="flex justify-center items-center h-48">
        <Spinner />
    </div>
{:else if repos.length === 0}
    <div
        class="flex flex-col items-center justify-center text-center py-16 px-4 text-gray-500 dark:text-gray-400"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-12 h-12 mb-4 text-[#6165ec]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            />
        </svg>
        <p class="text-lg font-medium">No repositories managed yet</p>
        <p class="text-sm mb-4">
            Start by adding a GitHub repository to manage.
        </p>
        <button
            class="bg-[#6165ec] hover:bg-[#4e51cc] text-white text-sm px-4 py-2 rounded-lg transition-colors"
            onclick={openModal}
        >
            + Add Repo
        </button>
    </div>
{:else}
    <div class="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
        {#each repos as repo}
            <a
                href="/app/manager/{repo.repository_id}"
                data-sveltekit-preload-data="off"
                class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700
           shadow-sm rounded-2xl p-4 transition-all transform hover:shadow-xl
           hover:scale-[1.01] hover:border-[#6165ec] dark:hover:border-[#6165ec]"
            >
                <div class="flex items-center gap-4 mb-4">
                    <img
                        src={repo.owner.avatar_url}
                        alt="Avatar"
                        class="w-12 h-12 rounded-full border border-gray-300 dark:border-slate-600"
                    />
                    <div>
                        <div
                            class="text-lg font-semibold text-gray-800 dark:text-gray-100"
                        >
                            {repo.name}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                            @{repo.owner.login}
                        </div>
                    </div>
                </div>
                <div class="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <div>
                        <span class="font-medium">Visibility:</span>
                        <span
                            class={repo.visibility === "public"
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"}
                        >
                            {repo.visibility}
                        </span>
                    </div>
                    <div>
                        <span class="font-medium">Webhook:</span>
                        {#if repo.webhook}
                            <span class="text-green-600 dark:text-green-400"
                                >{repo.webhook}</span
                            >
                        {:else}
                            <span class="text-gray-400 dark:text-gray-500"
                                >Not Set</span
                            >
                        {/if}
                    </div>
                    <div>
                        <span class="font-medium">Repo ID:</span>
                        {repo.repository_id}
                    </div>
                </div>
            </a>
        {/each}
    </div>
{/if}

{#if showAddModal}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
        <div
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-xl p-6 relative"
        >
            <h3
                class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4"
            >
                Select a Repository to Manage
            </h3>

            {#if addingRepo}
                <div
                    class="flex items-center justify-center absolute top-6 right-50"
                >
                    <Spinner class="mb-5" />
                </div>
            {/if}

            {#if loadingRepos}
                <div class="text-gray-500 dark:text-gray-400">
                    Loading repositories…
                </div>
            {:else}
                <ul
                    class="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto"
                >
                    {#each githubRepos as repo}
                        <li>
                            <button
                                disabled={addingRepo}
                                type="button"
                                onclick={() => addRepo(repo)}
                                class="w-full flex items-start justify-between text-left p-4 rounded-xl border
               border-slate-700 bg-slate-800 hover:bg-slate-700 transition group focus:outline-none focus:ring-2 focus:ring-[#6165ec] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <div class="space-y-1">
                                    <div
                                        class="text-sm font-semibold text-white group-hover:underline"
                                    >
                                        {repo.name}
                                    </div>
                                    <div class="text-xs text-gray-400">
                                        @{repo.owner.login}
                                    </div>
                                    {#if repo.description}
                                        <p
                                            class="text-xs text-gray-500 mt-1 line-clamp-2"
                                        >
                                            {repo.description}
                                        </p>
                                    {/if}
                                </div>

                                <div class="text-xs text-gray-400 self-center">
                                    {repo.private ? "🔒 Private" : "🌐 Public"}
                                </div>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}

            <!-- Close -->
            <button
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                onclick={closeModal}
                aria-label="Close"
            >
                ✕
            </button>
        </div>
    </div>
{/if}
