export function parseErrorMessage(
    err: unknown,
    defaultMessage = 'Something went wrong'
): string {
    if (typeof err === 'string') {
        return err;
    }

    if (err && typeof err === 'object' && 'message' in err && typeof err.message === 'string') {
        return err.message;
    }

    if (
        err &&
        typeof err === 'object' &&
        'error' in err &&
        typeof err.error === 'object' &&
        err.error &&
        'message' in err.error &&
        typeof err.error.message === 'string'
    ) {
        return err.error.message;
    }

    if (
        err &&
        typeof err === 'object' &&
        'error_description' in err &&
        typeof err.error_description === 'string'
    ) {
        return err.error_description;
    }

    if (err && typeof err === 'object' && 'error' in err && typeof err.error === 'string') {
        return err.error;
    }

    if (err && typeof err === 'object' && 'data' in err) {
        return parseErrorMessage(err.data);
    }

    if (err instanceof Error) {
        return err.message;
    }

    return defaultMessage;
}
