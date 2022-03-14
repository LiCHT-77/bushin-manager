<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>階級設定</h1>
        <setting-breadcrumbs></setting-breadcrumbs>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <division-form
          :contest-id="contestId"
          :division-id="divisionId"
          :loading="divisionLoading"
          @save="saveDivision($event)"
        ></division-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>ラウンド設定</v-card-title>
          <v-card-subtitle
            >ドラッグ&ドロップで表示順の並べ替えができます。</v-card-subtitle
          >
          <v-card-text>
            <block-group-setting-list
              :key="bgListKey"
              :contest-id="contestId"
              :division-id="divisionId"
            ></block-group-setting-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" outlined @click="openBgForm()">
              ラウンドを追加
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="bgDialog" width="500">
          <block-group-form
            :key="bgFormKey"
            :contest-id="contestId"
            :division-id="divisionId"
            :loading="bgLoading"
            @save="saveBlockGroup($event)"
          ></block-group-form>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import DivisionForm from '~/components/divisions/DivisionForm.vue';
import BlockGroupForm from '~/components/blockGroups/BlockGroupForm.vue';
import BlockGroupSettingList from '~/components/blockGroups/BlockGroupSettingList.vue';
import SettingBreadcrumbs from '~/components/SettingBreadcrumbs.vue';
import { useDivision, useBlockGroup } from '~/composable';
import { Division, BlockGroup } from '~/models';

export default defineComponent({
  components: {
    DivisionForm,
    BlockGroupForm,
    BlockGroupSettingList,
    SettingBreadcrumbs,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '階級編集';

    // setup
    const route = useRoute();
    const contestId = route.value.params.contestId;
    const divisionId = route.value.params.divisionId;

    // update Division
    const { updateDivision } = useDivision();
    const divisionLoading = ref(false);
    const saveDivision = async (division: Division) => {
      divisionLoading.value = true;
      const start = performance.now();
      await updateDivision(contestId, division.value);
      const t = performance.now() - start;
      setTimeout(() => {
        divisionLoading.value = false;
      }, 1000 - t);
    };

    // rerender BlockGroupForm and BlockGroupList when saved
    const bgFormKey = ref(0);
    const bgListKey = ref(0);

    // create BlockGroup
    const bgLoading = ref(false);
    const bgDialog = ref(false);

    const openBgForm = () => {
      bgFormKey.value++;
      bgDialog.value = true;
    };

    const { createBlockGroup } = useBlockGroup();
    const saveBlockGroup = async (blockGroup: BlockGroup) => {
      const start = performance.now();
      bgDialog.value = false;
      await createBlockGroup(contestId, blockGroup.value);
      const t = performance.now() - start;
      setTimeout(() => {
        bgLoading.value = false;
        bgListKey.value++;
      }, 1000 - t);
    };

    return {
      contestId,
      divisionId,
      divisionLoading,
      saveDivision,
      bgFormKey,
      bgListKey,
      bgLoading,
      bgDialog,
      openBgForm,
      saveBlockGroup,
    };
  },
  head: {},
});
</script>

<style>
</style>