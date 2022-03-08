import { ref, useContext } from '@nuxtjs/composition-api';
import { orderBy } from 'firebase/firestore';
import { BlockGroupCollectionKeys } from '~/models/blockGroup';
import { BlockGroup } from '~/types/model';
import { BlockGroupRepository } from '~/types/repositories';

export default function useBlockGroups() {
    const { $reps } = useContext();
    const blockGroupRep: BlockGroupRepository = $reps.blockGroupRep;
    const blockGroups = ref<BlockGroup[]>([]);

    const getBlockGroupColKeys = (contestId: string, divisionId: string): BlockGroupCollectionKeys => {
        return {
            contests: contestId,
            divisions: divisionId
        };
    };

    const getBlockGroupList = async (contestId: string, divisionId: string) => {
        const blockGroupColKeys = getBlockGroupColKeys(contestId, divisionId);
        const sort = orderBy('order', 'asc');
        blockGroups.value = await blockGroupRep.getList(blockGroupColKeys, [sort]);
    };

    const updateOrders = async (contestId: string, divisionId: string) => {
        const blockGroupColKeys = getBlockGroupColKeys(contestId, divisionId);
        await blockGroupRep.updateOrders(blockGroupColKeys, blockGroups.value);
    };

    return {
        blockGroups,
        getBlockGroupList,
        updateOrders,
    };
}
