<script>
    import { get } from "$lib/utils/api";
    import { onMount } from "svelte";
    let { data } = $props();

    let loading = $state(true);

    let cpu = $state({ percent: 0, used: 0, total: 0 }); // GHz
    let ram = $state({ percent: 0, used: 0, total: 0 }); // GB
    let disk = $state({ percent: 0, used: 0, total: 0 }); // GB

    let os = $state("...");
    let apps = $state([]);

    const circleRadius = 40;
    const circumference = 2 * Math.PI * circleRadius;

    function getOffset(percent) {
        return circumference - (percent / 100) * circumference;
    }

    function formatUnit(value, unit = "GB", precision = 1) {
        return `${value.toFixed(precision)} ${unit}`;
    }

    const fetchData = async () => {
        try {
            const res = await get("/system/info", data.accessToken);
            if (!res) throw new Error("No response");

            const {
                cpu: cpuData,
                ram: ramData,
                disk: diskData,
                os: osInfo,
                apps: appList,
            } = res;

            cpu = cpuData;
            ram = ramData;
            disk = diskData;
            os = osInfo;
            apps = appList || [];
        } catch (e) {
            console.error("Failed to fetch system info", e);
        }
    };

    onMount(async () => {
        loading = true;
        await fetchData();
        loading = false;
    });
</script>

<div class="p-6 space-y-8">
    <h1 class="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        System Dashboard
    </h1>

    {#if loading}
        <!-- Skeletons -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {#each Array(3) as _}
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 animate-pulse"
                >
                    <div
                        class="mx-auto w-[100px] h-[100px] rounded-full bg-gray-200 dark:bg-gray-700 mb-4"
                    ></div>
                    <div
                        class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"
                    ></div>
                    <div
                        class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"
                    ></div>
                    <div
                        class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto mt-2"
                    ></div>
                </div>
            {/each}
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-8 animate-pulse"
        >
            <div
                class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"
            ></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>

        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mt-8 animate-pulse"
        >
            <div
                class="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4"
            ></div>
            {#each Array(3) as _}
                <div
                    class="flex justify-between items-center px-3 py-3 bg-gray-100 dark:bg-gray-700 rounded-md mb-2"
                >
                    <div class="space-y-2 w-2/3">
                        <div
                            class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"
                        ></div>
                        <div
                            class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"
                        ></div>
                    </div>
                    <div class="space-y-1 text-right w-1/3">
                        <div
                            class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"
                        ></div>
                        <div
                            class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4 ml-auto"
                        ></div>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {#each [{ label: "CPU Usage", data: cpu, color: "stroke-blue-500", format: `${formatUnit(cpu.used, "GHz")} / ${formatUnit(cpu.total, "GHz")}` }, { label: "RAM Usage", data: ram, color: "stroke-green-500", format: `${formatUnit(ram.used)} / ${formatUnit(ram.total)}` }, { label: "Disk Usage", data: disk, color: "stroke-pink-500", format: `${formatUnit(disk.used)} / ${formatUnit(disk.total)}` }] as item}
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow p-4 text-center"
                >
                    <svg width="100" height="100" class="mx-auto mb-2">
                        <circle
                            cx="50"
                            cy="50"
                            r={circleRadius}
                            class="stroke-current text-gray-300 dark:text-gray-700"
                            stroke-width="10"
                            fill="transparent"
                        />
                        <circle
                            cx="50"
                            cy="50"
                            r={circleRadius}
                            class={`stroke-current ${item.color}`}
                            stroke-width="10"
                            fill="transparent"
                            stroke-dasharray={circumference}
                            stroke-dashoffset={getOffset(item.data.percent)}
                            stroke-linecap="round"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div class="text-lg font-semibold">{item.label}</div>
                    <div class="text-xl">{item.data.percent}%</div>
                    <div class="text-sm text-gray-600 dark:text-gray-400">
                        {item.format}
                    </div>
                </div>
            {/each}
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 class="text-lg font-semibold mb-2">Operating System</h2>
            <p class="text-sm text-gray-700 dark:text-gray-300">{os}</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 class="text-lg font-semibold mb-4">Running Applications</h2>
            <div class="space-y-2">
                {#each apps as app}
                    <div
                        class="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                    >
                        <div class="flex flex-col">
                            <span class="font-medium">{app.name}</span>
                            <span
                                class="text-xs text-gray-500 dark:text-gray-400"
                                >{app.status}</span
                            >
                        </div>
                        <div class="text-sm text-right">
                            <div>CPU: {app.cpu}%</div>
                            <div>RAM: {app.mem} MB</div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
