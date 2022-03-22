import { ref, useContext } from "@nuxtjs/composition-api";
import { Record } from "~/models";
import { RecordRepository } from "~/repositories";

export default function useRecord() {
    const { $reps } = useContext();
    const recordRep = $reps.recordRep;

    const record = ref<Record>(recordRep.newModelInstance());

    const getRecord = async (contestId: string, blockId: string, recordId: string) => {
        const collectionPath = RecordRepository.getCollectionPath(contestId, blockId);
        record.value = await recordRep.find(collectionPath, recordId);
    };

    const createRecord = async (contestId: string, blockId: string, record: Record) => {
        const collectionPath = RecordRepository.getCollectionPath(contestId, blockId);
        await recordRep.add(collectionPath, record);
    };

    const updateRecord = async (contestId: string, blockId: string, record: Record) => {
        const collectionPath = RecordRepository.getCollectionPath(contestId, blockId);
        await recordRep.update(collectionPath, record);
    };

    const deleteRecord = async (contestId: string, blockId: string, recordId: string) => {
        const collectionPath = RecordRepository.getCollectionPath(contestId, blockId);
        await recordRep.delete(collectionPath, recordId);
    };

    return {
        record,
        getRecord,
        createRecord,
        updateRecord,
        deleteRecord,
    };
}
