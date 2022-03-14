import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy } from 'firebase/firestore';
import { Division } from '~/models';
import { DivisionRepository } from '~/repositories';

export default function useDivisions() {
    const { $reps } = useContext();
    const divisionRep: DivisionRepository = $reps.divisionRep;
    const divisions = ref<Division[]>([]);

    const getDivisionList = async (contestId: string) => {
        const collectionPath = DivisionRepository.getCollectionPath(contestId);
        const sort = orderBy('order', 'asc');
        divisions.value = await divisionRep.getList(collectionPath, [sort]);
    };

    const updateOrders = async (contestId: string, divisions: Division[]) => {
        const collectionPath = DivisionRepository.getCollectionPath(contestId);
        await divisionRep.updateOrders(collectionPath, divisions);
    };

    return {
        divisions,
        getDivisionList,
        updateOrders,
    };
}