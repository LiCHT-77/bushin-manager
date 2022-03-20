import { InjectionKey, reactive, ref, useContext } from "@nuxtjs/composition-api";
import { orderBy } from "firebase/firestore";
import { BlockGroupRepository, BlockRepository, DivisionRepository } from "~/repositories";

export const useBlockTree = () => {
    const tree = reactive<{[key: string]: any}>({});
    const flatBlocks = ref<Array<{text: string, value: string}>>([]);

    const {$reps} = useContext();
    const loadTree =  async (contestId: string) => {
        const divisionCollectionPath = DivisionRepository.getCollectionPath(contestId);
        const blockGroupCollectionPath = BlockGroupRepository.getCollectionPath(contestId);
        const blockCollectionPath = BlockRepository.getCollectionPath(contestId);

        const divisions = await $reps.divisionRep.getList(divisionCollectionPath, [orderBy('order', 'asc')]);
        const blockGroups = await $reps.blockGroupRep.getList(blockGroupCollectionPath, [orderBy('order', 'asc')]);
        const blocks = await $reps.blockRep.getList(blockCollectionPath, [orderBy('order', 'asc')]);

        for (const division of divisions) {
            tree[division.id] = division;
            tree[division.id].children = {};
            const divBlockGroups = blockGroups.filter((blockGroup) => blockGroup.divisionId === division.id);
            for (const blockGroup of divBlockGroups) {
                tree[division.id].children[blockGroup.id] = blockGroup;
                tree[division.id].children[blockGroup.id].children = {};
                const bgBlocks = blocks.filter((block) => block.blockGroupId === blockGroup.id);
                for (const block of bgBlocks) {
                    tree[division.id].children[blockGroup.id].children[block.id] = block;
                    flatBlocks.value.push({
                        text: `${division.name}/${blockGroup.name}/${block.name}`,
                        value: block.id,
                    });
                }
            }
        }
    };

    return {
        tree,
        loadTree,
        flatBlocks,
    };
};

type UseBlockTreeReturn = ReturnType<typeof useBlockTree>
export const blockTreeKey: InjectionKey<UseBlockTreeReturn> = Symbol('BlockTree');
