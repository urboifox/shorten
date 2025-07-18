import { buildRequestOptions, endpoint } from '$lib/server/utils';
import { parseErrorMessage } from '$lib/utils';
import { error, fail, type ActionFailure } from '@sveltejs/kit';

export type FetcherInit = Omit<RequestInit, 'body'> & {
    /**
     *  The query parameters to append to the endpoint URL.
     */
    params?: Record<string, string | number | boolean | undefined | null>;
    /**
     *  If set to 'action', the error will be thrown using svelte's `fail` function.
     *  Otherwise, it will be thrown using the `error` function.
     *  @default 'load'
     */
    env?: 'load' | 'action';
    /**
     *  Timeout in seconds before cancelling the request.
     *  @default 10
     */
    timeout?: number;
    /**
     *  The request body.
     */
    body?: FormData | Record<string, unknown>;
    /**
     *  If set to `true`, the response will be parsed as JSON.
     *  @default true
     */
    parse?: boolean;
};

// For skipping parsing
export async function fetcher(
    fetch: typeof window.fetch,
    path: string,
    init: FetcherInit & { parse: false }
): Promise<Response>;

// For actions, returns ActionFailure on error
export async function fetcher<T = unknown>(
    fetch: typeof window.fetch,
    path: string,
    init: FetcherInit & { env: 'action'; parse?: true }
): Promise<T | ActionFailure<{ message: string; data: unknown }>>;

// For loads (default)
export async function fetcher<T = unknown>(
    fetch: typeof window.fetch,
    path: string,
    init?: FetcherInit & { env?: 'load' }
): Promise<T>;

/**
 *  Fetches data from the API and returns it as a typed object.
 *  If the response is not successful, it will throw an error or fail based on the `env` option.
 */
export async function fetcher<T = unknown>(
    fetch: typeof window.fetch,
    path: string,
    init: FetcherInit = {}
): Promise<Response | T | ActionFailure<{ message: string; data: unknown }>> {
    const { params, env = 'load', parse = true, timeout = 10, ...rest } = init;
    const options = buildRequestOptions(rest);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout * 1000);

    try {
        const res = await fetch(endpoint(path, params), {
            ...options,
            signal: options.signal ?? controller.signal
        });

        clearTimeout(timeoutId);

        if (!parse) {
            return res;
        }

        const data = await res.json().catch(() => ({}));

        if (!res.ok || data?.success === false) {
            const message = parseErrorMessage(data);
            if (env === 'action') {
                return fail(res.status ?? 400, { message, data });
            } else {
                throw error(res.status ?? 400, message);
            }
        }

        return data as T;
    } catch (err) {
        clearTimeout(timeoutId);
        throw err;
    }
}

export function isFailure(value: unknown): value is ActionFailure<Record<string, unknown>> {
    return (
        value != null &&
        typeof value === 'object' &&
        'status' in value &&
        'data' in value &&
        typeof value.status === 'number' &&
        value.status >= 400 &&
        value.status < 600
    );
}
