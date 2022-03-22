import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { Repository } from "./repository";
import { Record } from "~/models";
import { ModelConstructor } from "~/types/model";

declare const RecordCollectionPathSym: unique symbol;
export type RecordCollectionPath = string & { [RecordCollectionPathSym]: never; };

export const isRecordCollPath = (val: string): val is RecordCollectionPath => /contests\/.*\/blocks\/.*\/records/.test(val);

export class RecordRepository extends Repository<Record, RecordCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Record> = Record,
        collectionName: string = 'records',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(contestId: string, blockId: string): RecordCollectionPath {
        return `contests/${contestId}/blocks/${blockId}/records` as RecordCollectionPath;
    }

    async updateOrders(collectionPath: RecordCollectionPath, records: Record[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
            const refOrders: { ref: DocumentReference, id: string, order: number; }[] = [];
            for (const [index, record] of records.entries()) {
                const docRef = doc(this.firestore, collectionPath, record.id);
                const recordDoc = await transaction.get(docRef);
                if (!recordDoc.exists()) {
                    throw new Error(`Document does not exist!: path=${docRef.path}`);
                }
                refOrders.push({
                    ref: docRef,
                    id: record.id,
                    order: index + 1,
                });
            }
            for (const refOrder of refOrders) {
                transaction.update(refOrder.ref, { order: refOrder.order });
            }
        });
    }
}