import { Ref, ref } from "@nuxtjs/composition-api";


export default function useLoading() {
    const start = ref(0);

    const loadingStart = (loading: Ref<boolean>) => {
        loading.value = true;
        start.value = performance.now();
    };

    const loadingEnd = (loading: Ref<boolean>) => {
        const t = performance.now() - start.value;
        setTimeout(() => {
            loading.value = false;
        }, 1000 - t);
    };

    const loadingSection = async (callback: (...args: any[]) => Promise<void>, loading: Ref<boolean>) => {
        loading.value = true;
        const start = performance.now();

        await callback();

        const t = performance.now() - start;
        setTimeout(() => {
            loading.value = false;
        }, 1000 - t);
    };

    return {
        loadingStart,
        loadingEnd,
        loadingSection,
    };
}