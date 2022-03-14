import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { Repository } from "./repository";
import { BlockGroup } from "~/models/blockGroup";
import { ModelConstructor } from "~/types/model";

declare const BlockGroupCollectionPathSym: unique symbol;
export type BlockGroupCollectionPath = string & { [BlockGroupCollectionPathSym]: never; };

export const isBlockGroupCollPath = (val: string): val is BlockGroupCollectionPath => /contests\/.*\/blockGroups/.test(val);

export class BlockGroupRepository extends Repository<BlockGroup, BlockGroupCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<BlockGroup> = BlockGroup,
        collectionName: string = 'blockGroups',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(contestId: string): BlockGroupCollectionPath {
        return `contests/${contestId}/blockGroups` as BlockGroupCollectionPath;
    }

    async updateOrders(collectionPath: BlockGroupCollectionPath, blockGroups: BlockGroup[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
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
                transaction.update(refOrder.ref, { order: refOrder.order });
            }
        });
    }
}