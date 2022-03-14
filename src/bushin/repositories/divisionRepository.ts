import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { Repository } from "./repository";
import { Division } from "~/models/division";
import { ModelConstructor } from "~/types/model";

declare const DivisionCollectionPathSym: unique symbol;

export type DivisionCollectionPath = string & { [DivisionCollectionPathSym]: never; };

export const isDivisionCollPath = (val: string): val is DivisionCollectionPath => /contests\/.*\/divisions/.test(val);

export class DivisionRepository extends Repository<Division, DivisionCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Division> = Division,
        collectionName: string = 'divisions',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(contestId: string): DivisionCollectionPath {
        return `contests/${contestId}/divisions` as DivisionCollectionPath;
    }

    async updateOrders(collectionPath: DivisionCollectionPath, divisions: Division[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
            const refOrders: { ref: DocumentReference, id: string, order: number; }[] = [];
            for (const [index, division] of divisions.entries()) {
                const docRef = doc(this.firestore, collectionPath, division.id);
                const divDoc = await transaction.get(docRef);
                if (!divDoc.exists()) {
                    throw new Error(`Document does not exist!: path=${docRef.path}`);
                }
                refOrders.push({
                    ref: docRef,
                    id: division.id,
                    order: index + 1,
                });
            }
            for (const refOrder of refOrders) {
                transaction.update(refOrder.ref, { order: refOrder.order });
            }
        });
    }
}