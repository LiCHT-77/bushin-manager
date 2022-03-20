import { ref, useContext } from "@nuxtjs/composition-api";
import { Block } from "~/models";
import { BlockRepository } from "~/repositories";

export default function useBlock() {
    const {$reps} = useContext();
    const blockRep = $reps.blockRep;

    const block = ref<Block>(blockRep.newModelInstance());

    const getBlock = async (contestId: string, blockId: string) => {
        const collectionPath = BlockRepository.getCollectionPath(contestId);
        block.value = await blockRep.find(collectionPath, blockId);
    };

    const createBlock = async (contestId: string, block: Block) => {
        const collectionPath = BlockRepository.getCollectionPath(contestId);
        await blockRep.add(collectionPath, block);
    };

    const updateBlock = async (contestId: string, block: Block,) => {
        const collectionPath = BlockRepository.getCollectionPath(contestId);
        await blockRep.update(collectionPath, block);
    };

    return {
        block,
        getBlock,
        createBlock,
        updateBlock,
    };
}
