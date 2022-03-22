import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy, QueryConstraint } from 'firebase/firestore';
import { Record } from '~/models';
import { RecordRepository } from '~/repositories';

export default function useRecords() {
    const { $reps } = useContext();
    const recordRep: RecordRepository = $reps.recordRep;
    const records = ref<Record[]>([]);

    const getRecordList = async (contestId: string, blockId: string) => {
        const collectionPath = RecordRepository.getCollectionPath(contestId, blockId);

        const query: QueryConstraint[] = [];

        query.push(
            orderBy('order', 'asc')
        );

        records.value = await recordRep.getList(collectionPath, query);
    };

    const updateOrders = async (contestId: string, blockId: string, records: Record[]) => {
        const recordColKeys = RecordRepository.getCollectionPath(contestId, blockId);
        await recordRep.updateOrders(recordColKeys, records);
    };

    return {
        records,
        getRecordList,
        updateOrders,
    };
}
