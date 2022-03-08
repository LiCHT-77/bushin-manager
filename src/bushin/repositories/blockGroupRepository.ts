import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { AbstractRepository } from "./abstractRepository";
import { BlockGroupCollectionKeys, BlockGroupModel } from "~/models/blockGroup";
import { BlockGroup, ModelConstructor } from "~/types/model";
import { BlockGroupRepository } from "~/types/repositories";


export class BlockGroupRepositoryImp extends AbstractRepository<BlockGroup, BlockGroupCollectionKeys> implements BlockGroupRepository {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<BlockGroup> = BlockGroupModel,
        collectionName: string = 'blockGroups',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    async updateOrders(collectionKeys: BlockGroupCollectionKeys, blockGroups: BlockGroup[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
            const collectionPath = this.getCollectionPath(collectionKeys);
            
            const refOrders: { ref: DocumentReference, id: string, order: number; }[] = [];
            for (const [index, blockGroup] of blockGroups.entries()) {
                const docRef = doc(this.firestore, collectionPath, blockGroup.id);
                const divDoc = await transaction.get(docRef);
                if (!divDoc.exists()) {
                    throw new Error(`Document does not exist!: path=${docRef.path}`);
                }
                refOrders.push({
                    ref: docRef,
                    id: blockGroup.id,
                    order: index + 1,
                });
            }
            for (const refOrder of refOrders) {
                transaction.update(refOrder.ref, {order: refOrder.order});
            }
        });
    }
}