import { useContext, useRoute } from "@nuxtjs/composition-api";


export default function useContestId() {
    const { error } = useContext();
    const route = useRoute();
    const contestId = route.value.query.contestId;
    if (typeof contestId !== 'string') {
        error({ statusCode: 404 });
        throw new Error("query parameter 'contestId' not found");
    }

    return {
        contestId
    };
}
