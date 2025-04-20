const isDevelopment = process.env.NODE_ENV === 'development';

export type Log = (message: unknown, isShowMessage?: boolean) => void;

export const logMessage: Log = (
    message: unknown,
    isShowMessage: boolean = isDevelopment
) => {
    // TODO: log to sentry

    if (isShowMessage) {
        console.log(message);
    }
}

export const logError: Log = (
    error: unknown,
    isShowMessage: boolean = isDevelopment
) => {
    // TODO: log to sentry

    if (isShowMessage) {
        console.error(error);
    }
}

