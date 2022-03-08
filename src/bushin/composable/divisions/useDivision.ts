import { ref, useContext } from "@nuxtjs/composition-api";
import { DivisionCollectionKeys } from "~/models/division";
import { Division } from "~/types/model";

export default function useDivision() {
    const {$reps} = useContext();
    const divisionRep = $reps.divisionRep;

    const division = ref<Division>(divisionRep.newModelInstance());

    const getDivisionColKeys = (contestId: string): DivisionCollectionKeys => {
        return {
            contests: contestId
        };
    };

    const getDivision = async (contestId: string, divisionId: string) => {
        division.value = await divisionRep.find(getDivisionColKeys(contestId), divisionId);
    };

    const createDivision = async (contestId: string, division: Division) => {
        await divisionRep.add(getDivisionColKeys(contestId), division);
    };

    const updateDivision = async (contestId: string, division: Division) => {
        await divisionRep.update(getDivisionColKeys(contestId), division);
    };

    return {
        division,
        getDivision,
        createDivision,
        updateDivision,
    };
}
