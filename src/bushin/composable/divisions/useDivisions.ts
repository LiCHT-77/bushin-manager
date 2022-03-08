import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy } from 'firebase/firestore';
import { DivisionCollectionKeys } from '~/models/division';
import { Division } from '~/types/model';
import { DivisionRepository } from '~/types/repositories';

export default function useDivisions() {
    const { $reps } = useContext();
    const divisionRep: DivisionRepository = $reps.divisionRep;
    const divisions = ref<Division[]>([]);

    const getDivisionColKeys = (contestId: string): DivisionCollectionKeys => {
        return {
            contests: contestId
        };
    };

    const getDivisionList = async (contestId: string) => {
        const divisionColKeys = getDivisionColKeys(contestId);
        const sort = orderBy('order', 'asc');
        divisions.value = await divisionRep.getList(divisionColKeys, [sort]);
    };

    const updateOrders = async (contestId: string) => {
        const divisionColKeys = getDivisionColKeys(contestId);
        await divisionRep.updateOrders(divisionColKeys, divisions.value);
    };

    return {
        divisions,
        getDivisionList,
        updateOrders,
    };
}