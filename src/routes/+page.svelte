<script lang="ts">
    import { enhance } from '$app/forms';
    import { parseErrorMessage } from '$lib/utils';
    import { Link2Icon, LinkIcon, LoaderCircleIcon, TextCursorIcon } from '@lucide/svelte';
    import { toast } from 'svelte-sonner';
    import type { PageServerData } from './$types.js';
    import Shorten from '$lib/components/shorten.svelte';
    import { flip } from 'svelte/animate';

    interface Props {
        data: PageServerData;
    }
    const { data }: Props = $props();

    let loading = $state(false);
</script>

<div class="container">
    <main class="flex flex-col items-center justify-center gap-6 mt-[30svh]">
        <div class="relative flex flex-col items-center gap-2">
            <LinkIcon class="text-primary absolute -top-20 -left-10" size={64} />
            <Link2Icon class="text-primary absolute -top-20 -right-10 rotate-12" size={64} />
            <TextCursorIcon
                class="text-primary absolute -right-20 -bottom-20 rotate-12"
                size={64}
            />
            <h1 class="text-primary text-center text-3xl font-semibold lg:text-5xl">
                Shorten - Create a short link
            </h1>
            <p class="text-foreground max-w-2xl text-center">
                Shorten is a custom shorten link tool, that helps you create sleek, custom URLs in
                one click. Simple, fast, and built for everyone.
            </p>
        </div>

        <form
            class="relative w-full max-w-2xl"
            method="post"
            action="?/shorten"
            use:enhance={() => {
                loading = true;
                return async ({ update, result }) => {
                    loading = false;
                    await update({ reset: true });
                    if (result.type === 'success') {
                        toast.success('Shorten success!');
                    } else if (result.type === 'failure') {
                        toast.error(parseErrorMessage(result));
                    }
                };
            }}
        >
            <input
                name="url"
                type="text"
                placeholder="Paste or enter a URL to shorten it!"
                class="bg-primary/5 caret-primary focus:ring-primary w-full rounded-2xl px-6 py-4 ring-1 ring-transparent transition-all duration-200 outline-none"
            />
            <button
                type="submit"
                disabled={loading}
                class="bg-primary hover:bg-primary/90 absolute end-2 top-1/2 flex min-w-24 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-white transition-colors disabled:cursor-not-allowed"
            >
                {#if loading}
                    <LoaderCircleIcon class="animate-spin" size={24} />
                {:else}
                    Shorten!
                {/if}
            </button>
        </form>

        <ul class="mt-4 flex w-full flex-col items-center gap-2">
            {#each data.uris as uri (uri.short_url)}
                <li class="w-full" animate:flip={{ duration: 200 }}>
                    <Shorten code={uri.short_url} />
                </li>
            {/each}
        </ul>
    </main>
</div>
