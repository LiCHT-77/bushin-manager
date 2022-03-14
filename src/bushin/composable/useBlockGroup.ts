import { ref, useContext } from "@nuxtjs/composition-api";
import { BlockGroup } from "~/models";
import { BlockGroupRepository } from "~/repositories";

export default function useBlockGroup() {
    const {$reps} = useContext();
    const blockGroupRep = $reps.blockGroupRep;

    const blockGroup = ref<BlockGroup>(blockGroupRep.newModelInstance());

    const getBlockGroup = async (contestId: string, blockGroupId: string) => {
        const collectionPath = BlockGroupRepository.getCollectionPath(contestId);
        blockGroup.value = await blockGroupRep.find(collectionPath, blockGroupId);
    };

    const createBlockGroup = async (contestId: string, blockGroup: BlockGroup) => {
        const collectionPath = BlockGroupRepository.getCollectionPath(contestId);
        await blockGroupRep.add(collectionPath, blockGroup);
    };

    const updateBlockGroup = async (contestId: string, blockGroup: BlockGroup,) => {
        const collectionPath = BlockGroupRepository.getCollectionPath(contestId);
        await blockGroupRep.update(collectionPath, blockGroup);
    };

    return {
        blockGroup,
        getBlockGroup,
        createBlockGroup,
        updateBlockGroup,
    };
}
