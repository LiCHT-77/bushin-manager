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
        ></block-group-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import BlockGroupForm from '~/components/blockGroups/BlockGroupForm.vue';
import { useBlockGroup } from '~/composable';

export default defineComponent({
  components: {
    BlockGroupForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = 'ラウンド編集';

    // setup
    const { error } = useContext();
    const route = useRoute();
    const contestId = route.value.query.contestId;
    if (typeof contestId !== 'string') {
      error({ statusCode: 404 });
      throw new Error("query parameter 'contestId' not found");
    }
    const blockGroupId = route.value.params.blockGroupId;
    
    const {blockGroup, getBlockGroup} = useBlockGroup();
    useFetch(async () => {
      await getBlockGroup(contestId, blockGroupId);
    });

    const bgLoading = ref(false);

    return {
      contestId,
      blockGroup,
      bgLoading,
    };
  },
  head: {},
});
</script>

<style>
</style>