'use client';

import { useEffect } from "react";
import toast , { Toaster , useToasterStore } from "react-hot-toast";

const TOAST_LIMIT = 1;

const ToasterContext = () => {
    const { toasts } = useToasterStore();

    useEffect(() => {
        toasts
        .filter((t) => t.visible)
        .filter((_, i) => i >= TOAST_LIMIT)
        .forEach((t) => toast.dismiss(t.id));
    }, [toasts]);

    return (
        <Toaster position='bottom-center'/>
    )
}

export default ToasterContext