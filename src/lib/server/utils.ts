import { API_URL } from '$env/static/private';
import type { FetcherInit } from '$lib/server/fetcher';

export function endpoint(
    path: string,
    params?: Record<string, string | number | boolean | undefined | null>
) {
    const apiBase = new URL(API_URL);
    apiBase.pathname = apiBase.pathname.replace(/\/$/, '') + '/api/v1';

    const [rawPath, rawQuery] = path.split('?');
    const fullPath = rawPath.replace(/^\/+/, '');
    apiBase.pathname += '/' + fullPath;

    const searchParams = new URLSearchParams(rawQuery);
    if (params) {
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null) continue;
            searchParams.set(key, value.toString());
        }
    }

    apiBase.search = searchParams.toString();
    return apiBase.toString();
}

function clean(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(clean).filter((v) => v !== undefined && v !== null && v !== '');
    }

    if (value && typeof value === 'object' && !(value instanceof FormData)) {
        return Object.fromEntries(
            Object.entries(value)
                .map(([k, v]) => [k, clean(v)])
                .filter(([, v]) => v !== undefined && v !== null && v !== '')
        );
    }

    return value;
}

export function payload(data: FormData | Record<string, unknown>) {
    if (data instanceof FormData) return data;

    const cleaned = clean(data);
    return JSON.stringify(cleaned);
}

export function buildRequestOptions(init: FetcherInit): RequestInit {
    const customHeaders: Record<string, string> = {
        Accept: 'application/json'
    };

    if (!(init.body instanceof FormData)) {
        customHeaders['Content-Type'] = 'application/json';
    }

    const headers: HeadersInit = { ...init.headers, ...customHeaders };

    const options: RequestInit = {
        ...init,
        headers,
        body: init.body ? payload(init.body) : undefined
    };

    return options;
}
