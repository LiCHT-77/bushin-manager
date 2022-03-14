import { ref, useContext } from "@nuxtjs/composition-api";
import { Division } from "~/models";
import { DivisionRepository } from "~/repositories";

export default function useDivision() {
    const {$reps} = useContext();
    const divisionRep = $reps.divisionRep;

    const division = ref<Division>(divisionRep.newModelInstance());

    const getDivision = async (contestId: string, divisionId: string) => {
        const collectionPath = DivisionRepository.getCollectionPath(contestId);
        division.value = await divisionRep.find(collectionPath, divisionId);
    };

    const createDivision = async (contestId: string, division: Division) => {
        const collectionPath = DivisionRepository.getCollectionPath(contestId);
        await divisionRep.add(collectionPath, division);
    };

    const updateDivision = async (contestId: string, division: Division) => {
        const collectionPath = DivisionRepository.getCollectionPath(contestId);
        await divisionRep.update(collectionPath, division);
    };

    return {
        division,
        getDivision,
        createDivision,
        updateDivision,
    };
}
