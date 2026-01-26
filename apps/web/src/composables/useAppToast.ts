import { useToast } from "vue-toastification";

export type ToastType = "success" | "error" | "info" | "warning";

export const useAppToast = () => {
    const toast = useToast();

    const showToast = (message: string, type: ToastType = "info") => {
        if (type === "success") {
            toast.success(message);
            return;
        }
        if (type === "error") {
            toast.error(message);
            return;
        }
        if (type === "warning") {
            toast.warning(message);
            return;
        }
        toast.info(message);
    };

    return { showToast };
};
