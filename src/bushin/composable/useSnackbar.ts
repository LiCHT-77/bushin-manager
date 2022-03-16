import { InjectionKey, reactive } from "@nuxtjs/composition-api";
import { SnackBarItem } from "~/types/state";

export const useSnackbarState = () => {
    const state = reactive<SnackBarItem>({
        color: '',
        text: '',
        active: false,
    });

    const setSnackbar = (val: Partial<SnackBarItem>) => {
        if (val.color !== undefined) {
            state.color = val.color;
        }
        if (val.text !== undefined) {
            state.text = val.text;
        }
        state.active = true;
    };

    return {
        state,
        setSnackbar,
    };
};

export type SnackbarState = ReturnType<typeof useSnackbarState>;
export const snackbarStateKey: InjectionKey<SnackbarState> = Symbol('SnackbarState');
