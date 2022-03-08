import { ref, useContext } from "@nuxtjs/composition-api";
import { Contest } from "~/types/model";


export default function useContest() {
    const {$reps} = useContext();
    const contestRep = $reps.contestRep;

    const contest = ref<Contest>(contestRep.newModelInstance());

    const getContest = async (contestId: string) => {
        contest.value = await contestRep.find({}, contestId);
    };

    const createContest = async (contest: Contest) => {
        await contestRep.add({}, contest);
    };

    const updateContest = async (contest: Contest) => {
        await contestRep.update({}, contest);
    };


    return {
        contest,
        getContest,
        createContest,
        updateContest,
    };
}
