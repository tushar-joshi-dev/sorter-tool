import { Slide, toast as toastifyToast } from "react-toastify";

export enum ToastType {
    SUCCESS, WARN, ERROR
};

export const toast = (message: string, type: ToastType, durationMs: number = 5000): void => {
    switch (type) {
        case ToastType.SUCCESS:
            toastifyToast.success(message, {
                position: 'top-right',
                autoClose: durationMs,
                draggable: false,
                transition: Slide
            });
            break;
        case ToastType.WARN:
            console.warn(message);
            toastifyToast.warn(message, {
                position: 'top-right',
                autoClose: durationMs,
                draggable: false,
                transition: Slide
            });
            break;
        case ToastType.ERROR:
            console.error(message);
            toastifyToast.error(message, {
                position: 'top-right',
                autoClose: durationMs,
                draggable: false,
                transition: Slide
            });
            break;
        default:
            toastifyToast.info(message, {
                position: 'top-right',
                autoClose: durationMs,
                draggable: false,
                transition: Slide
            });
            break;
    }

};