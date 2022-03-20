import { doc, DocumentReference, Firestore, runTransaction } from "firebase/firestore";
import { Repository } from "./repository";
import { Block } from "~/models/block";
import { ModelConstructor } from "~/types/model";

declare const BlockCollectionPathSym: unique symbol;
export type BlockCollectionPath = string & { [BlockCollectionPathSym]: never; };

export const isBlockCollPath = (val: string): val is BlockCollectionPath => /contests\/.*\/blocks/.test(val);

export class BlockRepository extends Repository<Block, BlockCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Block> = Block,
        collectionName: string = 'blocks',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(contestId: string): BlockCollectionPath {
        return `contests/${contestId}/blocks` as BlockCollectionPath;
    }

    async updateOrders(collectionPath: BlockCollectionPath, blocks: Block[]): Promise<void> {
        await runTransaction(this.firestore, async (transaction) => {
            const refOrders: { ref: DocumentReference, id: string, order: number; }[] = [];
            for (const [index, block] of blocks.entries()) {
                const docRef = doc(this.firestore, collectionPath, block.id);
                const divDoc = await transaction.get(docRef);
                if (!divDoc.exists()) {
                    throw new Error(`Document does not exist!: path=${docRef.path}`);
                }
                refOrders.push({
                    ref: docRef,
                    id: block.id,
                    order: index + 1,
                });
            }
            for (const refOrder of refOrders) {
                transaction.update(refOrder.ref, { order: refOrder.order });
            }
        });
    }
}