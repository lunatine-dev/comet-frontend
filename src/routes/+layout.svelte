<script>
    import "../app.css";

    let { children } = $props();
</script>

<svelte:head>
    <title>comet</title>
</svelte:head>

{@render children()}
