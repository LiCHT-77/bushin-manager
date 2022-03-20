import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy, QueryConstraint, where } from 'firebase/firestore';
import { Block } from '~/models';
import { BlockRepository } from '~/repositories';

export default function useBlocks() {
    const { $reps } = useContext();
    const blockRep: BlockRepository = $reps.blockRep;
    const blocks = ref<Block[]>([]);

    const getBlockList = async (contestId: string, blockGroupId?: string) => {
        const collectionPath = BlockRepository.getCollectionPath(contestId);

        const query: QueryConstraint[] = [];

        if (blockGroupId !== undefined) {
            query.push(
                where('block_group_id', '==', blockGroupId)
            );
        }

        query.push(
            orderBy('order', 'asc')
        );

        blocks.value = await blockRep.getList(collectionPath, query);
    };

    const updateOrders = async (contestId: string, blocks: Block[]) => {
        const blockColKeys = BlockRepository.getCollectionPath(contestId);
        await blockRep.updateOrders(blockColKeys, blocks);
    };

    return {
        blocks,
        getBlockList,
        updateOrders,
    };
}
