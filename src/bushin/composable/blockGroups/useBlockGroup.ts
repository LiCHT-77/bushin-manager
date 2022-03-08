import { ref, useContext } from "@nuxtjs/composition-api";
import { BlockGroupCollectionKeys } from "~/models/blockGroup";
import { BlockGroup } from "~/types/model";

export default function useBlockGroup() {
    const {$reps} = useContext();
    const blockGroupRep = $reps.blockGroupRep;

    const blockGroup = ref<BlockGroup>(blockGroupRep.newModelInstance());

    // TODO: とこかに集約すべき
    const getBlockGroupColKeys = (contestId: string, divisionId: string): BlockGroupCollectionKeys => {
        return {
            contests: contestId,
            divisions: divisionId
        };
    };

    const getBlockGroup = async (contestId: string, divisionId: string, blockGroupId: string) => {
        blockGroup.value = await blockGroupRep.find(getBlockGroupColKeys(contestId, divisionId), blockGroupId);
    };

    const createBlockGroup = async (contestId: string, divisionId: string, blockGroup: BlockGroup) => {
        await blockGroupRep.add(getBlockGroupColKeys(contestId, divisionId), blockGroup);
    };

    const updateBlockGroup = async (contestId: string, divisionId: string, blockGroup: BlockGroup) => {
        await blockGroupRep.update(getBlockGroupColKeys(contestId, divisionId), blockGroup);
    };

    return {
        blockGroup,
        getBlockGroup,
        createBlockGroup,
        updateBlockGroup,
    };
}
