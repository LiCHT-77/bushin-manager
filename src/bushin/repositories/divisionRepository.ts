import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { AbstractRepository } from "./abstractRepository";
import { DivisionCollectionKeys, DivisionModel } from "~/models/division";
import { Division, ModelConstructor } from "~/types/model";
import { DivisionRepository } from "~/types/repositories";


export class DivisionRepositoryImp extends AbstractRepository<Division, DivisionCollectionKeys> implements DivisionRepository {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Division> = DivisionModel,
        collectionName: string = 'divisions',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    async updateOrders(collectionKeys: DivisionCollectionKeys, divisions: Division[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
            const collectionPath = this.getCollectionPath(collectionKeys);
            
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
                transaction.update(refOrder.ref, {order: refOrder.order});
            }
        });
    }
}