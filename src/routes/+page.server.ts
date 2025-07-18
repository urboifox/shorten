import { fetcher } from '$lib/server/fetcher';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const uris = await fetcher<BaseResponse<{ short_url: string }[]>>(fetch, '/api/uris');

    return { uris: uris.data };
};

export const actions = {
    shorten: async ({ request, fetch }) => {
        const data = await request.formData();

        const res = await fetcher(fetch, '/api/uris', {
            method: 'POST',
            env: 'action',
            body: { url: data.get('url') }
        });

        return res;
    }
} satisfies Actions;
