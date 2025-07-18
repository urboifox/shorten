import { fetcher, isFailure } from '$lib/server/fetcher';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
    const code = url.searchParams.get('code');

    const res = await fetcher<BaseResponse<{ url: string }>>(fetch, '/api/uris/' + code, {
        method: 'POST',
        env: 'action'
    });

    if (isFailure(res) || !res.data?.url) {
        return redirect(307, '/');
    }

    const redirectUrl = res.data.url.startsWith('http') ? res.data.url : `https://${res.data.url}`;

    return redirect(308, redirectUrl);
};
