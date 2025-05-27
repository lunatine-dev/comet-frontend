<script>
    import { PUBLIC_API_URL } from "$env/static/public";
    import { get, post } from "$lib/utils/api.js";
    import { Tabs, TabItem, Button, Spinner, Toggle } from "flowbite-svelte";
    import { GithubSolid } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    let { data } = $props();
    let loading = $state(true);

    const repoId = data.repo;

    let liveRepo = $state({});
    let repo = $state({});
    let webhooks = $state([]);
    let is_node_app = $state(false);
    let env = $state("");
    let rows = $state(1);
    const maxRows = 25;

    let webhooksSetup = false;
    let isNodeApp = false;

    $effect(() => {
        const lines = env.split("\n").length;
        rows = Math.min(lines, maxRows);
    });
    const syncWebhooks = async () => {
        // Trigger webhook sync
        console.log("Syncing webhooks...");
        loading = true;
        await post(`/repos/live/${repoId}/webhooks`, {}, data.accessToken);
        fetchData();
    };
    const saveEnv = async () => {
        await post(`/repos/live/${repoId}/env`, { env }, data.accessToken);
    };

    const joinUrl = (base, path) =>
        base.replace(/\/+$/, "") + "/" + path.replace(/^\/+/, "");

    const fetchRepo = {
        live: async () => {
            return await get("/repos/live/" + repoId, data.accessToken);
        },
        github: async (url) => {
            return await get(url, data.accessToken);
        },
        webhooks: async (url) => {
            url = joinUrl(url, "webhooks");
            return await get(url, data.accessToken);
        },
        is_node_app: async (url) => {
            url = joinUrl(url, "is_node_app");
            return await get(url, data.accessToken);
        },
    };

    const fetchData = async () => {
        loading = true;
        try {
            const {
                name,
                owner: { login },
                ...response
            } = await fetchRepo.live();

            env = response.env;
            liveRepo = response;

            const url = `/repos/github/${login}/${name}`;

            const funcs = [
                fetchRepo.github,
                fetchRepo.webhooks,
                fetchRepo.is_node_app,
            ];

            [repo, webhooks, { is_node_app }] = await Promise.all(
                funcs.map((fn) => fn(url))
            );
        } catch (err) {
            console.error("Failed to fetch repo data:", err);
            // optionally set an error state and show a message in the UI
        } finally {
            loading = false;
        }
    };
    onMount(() => {
        fetchData();
    });
</script>

{#if loading}
    <div class="flex justify-center items-center h-48">
        <Spinner />
    </div>
{:else}
    <Tabs>
        <TabItem open title="Details">
            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 text-white rounded-2xl"
            >
                <!-- Owner Card -->
                <div
                    class="flex flex-col items-center gap-4 bg-gray-800 p-6 rounded-2xl"
                >
                    <img
                        class="w-20 h-20 rounded-full border-2 border-purple-500"
                        src={repo.owner?.avatar_url}
                        alt="Owner avatar"
                    />
                    <h2 class="text-xl font-semibold">{repo.owner?.login}</h2>
                    <Button href={repo.html_url} color="purple"
                        >Open in GitHub</Button
                    >
                </div>

                <!-- Repo Details -->
                <div class="bg-gray-800 p-6 rounded-2xl shadow-inner space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2
                                class="text-2xl font-semibold flex items-center"
                            >
                                <GithubSolid class="mr-2" />
                                {repo.name}
                            </h2>
                        </div>
                        <span
                            class="text-sm px-2 py-1 rounded {repo.private
                                ? 'bg-red-500 text-white'
                                : 'bg-green-500 text-gray-700'}"
                            >{repo.private ? "Private" : "Public"}</span
                        >
                    </div>

                    <div class="flex items-center gap-2 text-yellow-400">
                        <span>⚡</span>
                        <span>{repo.language}</span>
                    </div>

                    <div class="text-sm space-y-1 text-gray-300">
                        <div>
                            📅 Created: {new Date(
                                repo.created_at
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            🛠️ Updated: {new Date(
                                repo.updated_at
                            ).toLocaleDateString()}
                        </div>
                        <div>
                            📂 Size: {repo.size} KB
                        </div>
                    </div>

                    <hr class="border-gray-700" />

                    <div class="space-y-2">
                        <div class="flex items-center justify-between">
                            <span>✅ Webhooks Setup</span>
                            <Toggle
                                checked={liveRepo.webhook ? true : false}
                                disabled
                            />
                        </div>

                        <div class="flex items-center justify-between">
                            <span>✅ Node.js App Detected</span>
                            <Toggle checked={is_node_app} disabled />
                        </div>
                        <div class="flex items-center justify-between">
                            <span>✅ Live</span>
                            <Toggle
                                checked={liveRepo?.directory_exists
                                    ? true
                                    : false}
                                disabled
                            />
                        </div>
                    </div>

                    <div class="pt-4">
                        <Button
                            disabled={!is_node_app && liveRepo?.webhook
                                ? false
                                : true}
                            onclick={syncWebhooks}
                            color="purple"
                            class="w-full">Sync Webhooks</Button
                        >
                    </div>
                </div>
            </div>
        </TabItem>

        <TabItem title="Environment">
            <div class="flex items-center justify-between px-4 pt-4 pb-2">
                <label
                    for="message"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >.env</label
                >
                <Button color="purple" class="cursor-pointer" onclick={saveEnv}
                    >Save</Button
                >
            </div>
            <textarea
                bind:value={env}
                {rows}
                class="lock p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            ></textarea>
        </TabItem>
    </Tabs>
{/if}
