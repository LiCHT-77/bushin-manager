import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy, QueryConstraint, where } from 'firebase/firestore';
import { BlockGroup, Division } from '~/models';
import { BlockGroupRepository } from '~/repositories';

export default function useBlockGroups() {
    const { $reps } = useContext();
    const blockGroupRep: BlockGroupRepository = $reps.blockGroupRep;
    const blockGroups = ref<BlockGroup[]>([]);

    // TODO: divisionId を渡すよう修正
    const getBlockGroupList = async (contestId: string, division?: Division) => {
        const blockGroupColKeys = BlockGroupRepository.getCollectionPath(contestId);

        const query: QueryConstraint[] = [];

        if (division !== undefined) {
            query.push(
                where('division_id', '==', division.id)
            );
        }

        query.push(
            orderBy('order', 'asc')
        );

        blockGroups.value = await blockGroupRep.getList(blockGroupColKeys, query);
    };

    const updateOrders = async (contestId: string, blockGroups: BlockGroup[]) => {
        const blockGroupColKeys = BlockGroupRepository.getCollectionPath(contestId);
        await blockGroupRep.updateOrders(blockGroupColKeys, blockGroups);
    };

    return {
        blockGroups,
        getBlockGroupList,
        updateOrders,
    };
}
