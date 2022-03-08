import { ref, useContext } from "@nuxtjs/composition-api";
import { Contest } from "~/types/model";
import { ContestRepository } from "~/types/repositories";

export default function useContests() {
    const { $reps } = useContext();
    const contestRep: ContestRepository = $reps.contestRep;

    // reactive variables
    const contests = ref<Contest[]>([]);

    const getContestList = async () => {
        contests.value = await contestRep.getList({});
    };

    return { contests, getContestList };
}