import { ref, useContext } from "@nuxtjs/composition-api";
import { Contest } from "~/models";
import { ContestRepository } from "~/repositories";

export default function useContests() {
    const { $reps } = useContext();
    const contestRep: ContestRepository = $reps.contestRep;

    // reactive variables
    const contests = ref<Contest[]>([]);

    const getContestList = async () => {
        const collectionPath = ContestRepository.getCollectionPath();
        contests.value = await contestRep.getList(collectionPath);
    };

    return { contests, getContestList };
}