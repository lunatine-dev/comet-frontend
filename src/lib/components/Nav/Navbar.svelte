<script>
    //Flowbite
    import Navbar from "flowbite-svelte/Navbar.svelte";
    import NavBrand from "flowbite-svelte/NavBrand.svelte";
    import DarkMode from "flowbite-svelte/DarkMode.svelte";
    import Avatar from "flowbite-svelte/Avatar.svelte";
    import NavHamburger from "flowbite-svelte/NavHamburger.svelte";
    import NavUl from "flowbite-svelte/NavUl.svelte";
    import NavItem from "./NavItem.svelte";

    //components
    import {
        HomeSolid,
        FolderOpenSolid,
        ServerSolid,
        LockSolid,
    } from "flowbite-svelte-icons";

    import { page } from "$app/stores";
    let { user = null } = $props();

    let activeUrl = $derived($page.url.pathname);
    let navItems = [
        {
            href: "/app",
            icon: HomeSolid,
            text: "Home",
            hideText: true,
        },
        {
            href: "/app/manager",
            icon: ServerSolid,
            text: "Manager",
        },
        {
            href: "/app/tokens",
            icon: LockSolid,
            text: "Tokens",
        },
    ];
</script>

<header
    class="bg-white border-b border-slate-600 dark:border-lethal-500 dark:bg-slate-800 py-2"
>
    <Navbar
        class="bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 divide-gray-200 dark:divide-gray-700 sm:px-4 flex items-center justify-between w-full mx-auto py-1.5 px-4"
    >
        <NavBrand href="/app">
            <img
                src="/logo-transparent.png"
                alt="Logo"
                class="me-3 h-6 sm:h-9"
            />
            <span
                class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
                >comet</span
            >
        </NavBrand>
        <NavUl
            {activeUrl}
            ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium items-start md:items-center"
        >
            {#each navItems as navItem}
                <NavItem
                    href={navItem.href}
                    icon={navItem.icon}
                    hideText={navItem?.hideText}>{navItem.text}</NavItem
                >
            {/each}
            <DarkMode
                class="mr-4 text-black dark:text-gray-200 dark:hover:text-white dark:hover:bg-transparent cursor-pointer"
            />
            <Avatar src={user.avatar}></Avatar>
        </NavUl>
        <NavHamburger />
    </Navbar>
</header>
