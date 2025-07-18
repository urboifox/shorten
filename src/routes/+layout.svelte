<script lang="ts">
    import { Toaster } from 'svelte-sonner';
    import '../app.css';

    let { children } = $props();
</script>

<svelte:head>
    <title>Shorten</title>
</svelte:head>

<Toaster position="bottom-right" />
{@render children()}
