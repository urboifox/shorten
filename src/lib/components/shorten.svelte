<script lang="ts">
    import { page } from '$app/state';
    import { CheckIcon, CopyIcon } from '@lucide/svelte';
    import { toast } from 'svelte-sonner';

    interface Props {
        code: string;
    }
    const { code }: Props = $props();

    let copied = $state(false);

    function handleCopy() {
        const params = new URLSearchParams();
        params.set('code', code);
        navigator.clipboard.writeText(page.url.href + 'navigate?' + params);
        toast.success('URL copied to clipboard!');

        setTimeout(() => {
            copied = false;
        }, 2000);
    }
</script>

<button
    class="bg-primary/5 text-primary flex w-full max-w-2xl cursor-pointer items-center justify-between gap-4 rounded-xl px-4 py-2 mx-auto"
    onclick={handleCopy}
>
    <span>
        {code}
    </span>
    <span>
        {#if copied}
            <CheckIcon size={18} />
        {:else}
            <CopyIcon size={18} />
        {/if}
    </span>
</button>
