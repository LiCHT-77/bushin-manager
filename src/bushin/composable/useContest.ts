import { ref, useContext } from "@nuxtjs/composition-api";
import { Contest } from "~/models";
import { ContestRepository } from "~/repositories";

export default function useContest() {
    const {$reps} = useContext();
    const contestRep = $reps.contestRep;

    const contest = ref<Contest>(contestRep.newModelInstance());

    const getContest = async (contestId: string) => {
        const collectionPath = ContestRepository.getCollectionPath();
        contest.value = await contestRep.find(collectionPath, contestId);
    };

    const createContest = async (contest: Contest) => {
        const collectionPath = ContestRepository.getCollectionPath();
        await contestRep.add(collectionPath, contest);
    };

    const updateContest = async (contest: Contest) => {
        const collectionPath = ContestRepository.getCollectionPath();
        await contestRep.update(collectionPath, contest);
    };


    return {
        contest,
        getContest,
        createContest,
        updateContest,
    };
}
