<script lang="ts">
    import '../app.css';

    let { children } = $props();
</script>

<svelte:head>
    <title>Shorten</title>
</svelte:head>

{@render children()}
