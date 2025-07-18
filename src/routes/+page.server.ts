import { fetcher } from '$lib/server/fetcher';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    // const uris = await fetcher<BaseResponse<{ uris: string[] }>>(fetch, '/api/uris');

    return { uris: [] };
};

export const actions = {
    shorten: async ({ request, fetch }) => {
        const data = await request.formData();

        const res = await fetcher(fetch, '/api/uris', {
            method: 'POST',
            env: 'action',
            body: { url: data.get('url') }
        });

        console.log('res', res);

        return res;
    }
} satisfies Actions;
