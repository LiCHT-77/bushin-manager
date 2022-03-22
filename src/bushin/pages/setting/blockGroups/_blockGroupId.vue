<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>ラウンド設定</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <block-group-form
          :block-group="blockGroup"
          :loading="bgLoading"
          @save="saveBlockGroup()"
        ></block-group-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h2>ブロック設定</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex align-center">
        <v-btn
          outlined
          small
          color="primary"
          :disabled="unSavedForm"
          @click="addBlock()"
          >ブロック追加<v-icon>mdi-plus</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-container>
          <draggable
            v-model="blocks"
            draggable=".block"
            handle=".handle"
            :animation="200"
            tag="v-row"
            :disabled="unSavedForm"
            @end="onFlippedBlock()"
          >
            <v-col
              v-for="(block, index) in blocks"
              :key="index"
              class="block"
              sm="12"
              md="6"
              lg="6"
              xl="6"
            >
              <block-form
                :block.sync="blocks[index]"
                :loading="blockLoading"
                @save="saveBlock(index)"
                @delete="onDeleteBlock($event)"
              ></block-form>
            </v-col>
          </draggable>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  provide,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import draggable from 'vuedraggable';
import BlockGroupForm from '~/components/blockGroups/BlockGroupForm.vue';
import BlockForm from '~/components/blocks/BlockForm.vue';
import {
  blockTreeKey,
  snackbarStateKey,
  useBlock,
  useBlockGroup,
  useBlocks,
  useBlockTree,
  useContestId,
  useLoading,
  useSnackbarState,
} from '~/composable';

export default defineComponent({
  components: {
    BlockGroupForm,
    draggable,
    BlockForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = 'ラウンド編集';

    // setup
    const snackbar = inject(snackbarStateKey, useSnackbarState());
    const { $reps } = useContext();
    const route = useRoute();
    const { contestId } = useContestId();
    const blockGroupId = route.value.params.blockGroupId;

    // get blockGroup and blocks
    const { blockGroup, getBlockGroup, updateBlockGroup } = useBlockGroup();
    const { blocks, getBlockList, updateOrders } = useBlocks();
    provide(blockTreeKey, useBlockTree());
    const blockTree = inject(blockTreeKey);
    if (blockTree === undefined) {
      throw new Error("con't get block tree");
    }
    useFetch(async () => {
      await blockTree.loadTree(contestId);
      await getBlockGroup(contestId, blockGroupId).catch((err) => {
        snackbar.setSnackbar({
          text: 'ラウンド情報の取得に失敗しました。',
          color: 'error',
        });
        throw err;
      });
      await getBlockList(contestId, blockGroupId).catch((err) => {
        snackbar.setSnackbar({
          text: 'ブロック情報の取得に失敗しました。',
          color: 'error',
        });
        throw err;
      });
    });

    // block group
    const { loadingSection } = useLoading();
    const bgLoading = ref(false);
    const saveBlockGroup = async () => {
      await loadingSection(async () => {
        await updateBlockGroup(contestId, blockGroup.value);
      }, bgLoading).catch((err) => {
        snackbar.setSnackbar({
          text: 'ラウンド情報の保存に失敗しました。',
          color: 'error',
        });
        bgLoading.value = false;
        throw err;
      });
    };

    // block
    const unSavedForm = ref(false);
    const blockLoading = ref(false);
    const { createBlock, updateBlock, deleteBlock } = useBlock();
    const saveBlock = async (blockIndex: number) => {
      await loadingSection(async () => {
        const block = blocks.value[blockIndex];
        if (block.id === '') {
          await createBlock(contestId, block);
          unSavedForm.value = false;
        } else {
          await updateBlock(contestId, block);
        }
      }, blockLoading).catch((err) => {
        snackbar.setSnackbar({
          text: 'ブロック情報の保存に失敗しました。',
          color: 'error',
        });
        blockLoading.value = false;
        throw err;
      });
      await getBlockList(contestId, blockGroupId).catch((err) => {
        snackbar.setSnackbar({
          text: 'ブロック情報の取得に失敗しました。',
          color: 'error',
        });
        throw err;
      });
    };

    const addBlock = () => {
      unSavedForm.value = true;
      const newBlock = $reps.blockRep.newModelInstance();
      newBlock.divisionId = blockGroup.value.divisionId;
      newBlock.blockGroupId = blockGroupId;
      newBlock.order = blocks.value.slice(-1)[0].order + 1;
      blocks.value.push(newBlock);
    };

    const onFlippedBlock = async () => {
      await updateOrders(contestId, blocks.value);
    };

    const onDeleteBlock = async (blockId: string) => {
      await deleteBlock(contestId, blockId);
      await getBlockList(contestId, blockGroupId).catch((err) => {
        snackbar.setSnackbar({
          text: 'ブロック情報の取得に失敗しました。',
          color: 'error',
        });
        throw err;
      });
    };

    return {
      contestId,
      blockGroup,
      bgLoading,
      saveBlockGroup,
      blocks,
      blockLoading,
      unSavedForm,
      saveBlock,
      addBlock,
      onFlippedBlock,
      onDeleteBlock,
    };
  },
  head: {},
});
</script>

<style>
</style>