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
        <block-cards
          :contest-id="contestId"
          :blocks.sync="blocks"
          :form-loading="blockLoading"
          :drag-disabled="unSavedForm"
          @save="saveBlock($event)"
          @flipped="onFlippedBlock()"
        ></block-cards>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import BlockGroupForm from '~/components/blockGroups/BlockGroupForm.vue';
import blockCards from '~/components/blocks/BlockCards.vue';
import {
  blockTreeKey,
  snackbarStateKey,
  useBlock,
  useBlockGroup,
  useBlocks,
  useLoading,
  useSnackbarState,
} from '~/composable';

export default defineComponent({
  components: {
    BlockGroupForm,
    blockCards,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = 'ラウンド編集';

    // setup
    const snackbar = inject(snackbarStateKey, useSnackbarState());
    const { error, $reps } = useContext();
    const route = useRoute();
    const contestId = route.value.query.contestId;
    if (typeof contestId !== 'string') {
      error({ statusCode: 404 });
      throw new Error("query parameter 'contestId' not found");
    }
    const blockGroupId = route.value.params.blockGroupId;

    // get blockGroup and blocks
    const { blockGroup, getBlockGroup, updateBlockGroup } = useBlockGroup();
    const { blocks, getBlockList } = useBlocks();
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

    const { loadingSection } = useLoading();
    // block group
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
    const { createBlock, updateBlock } = useBlock();
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
    };

    const addBlock = () => {
      unSavedForm.value = true;
      const newBlock = $reps.blockRep.newModelInstance();
      newBlock.blockGroupId = blockGroupId;
      blocks.value.push(newBlock);
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
    };
  },
  head: {},
});
</script>

<style>
</style>