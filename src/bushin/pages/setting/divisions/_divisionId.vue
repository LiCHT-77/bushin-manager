<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>階級設定</h1>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <division-form
          :division.sync="division"
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
              :contest-id="contestId"
              :block-groups="blockGroups"
            ></block-group-setting-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" outlined @click="dialog = true">
              ラウンドを追加
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dialog" width="500">
          <block-group-form
            :block-group.sync="blockGroup"
            :loading="bgLoading"
            @save="saveBlockGroup()"
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
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import DivisionForm from '~/components/divisions/DivisionForm.vue';
import BlockGroupForm from '~/components/blockGroups/BlockGroupForm.vue';
import BlockGroupSettingList from '~/components/blockGroups/BlockGroupSettingList.vue';
import { useDivision, useBlockGroup, useBlockGroups } from '~/composable';
import { Division } from '~/models';

export default defineComponent({
  components: {
    DivisionForm,
    BlockGroupForm,
    BlockGroupSettingList,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '階級編集';

    // setup
    const { error, $reps } = useContext();
    const route = useRoute();
    const contestId = route.value.query.contestId;
    if (typeof contestId !== 'string') {
      error({ statusCode: 404 });
      throw new Error("query parameter 'contestId' not found");
    }
    const divisionId = route.value.params.divisionId;

    const { division, getDivision, updateDivision } = useDivision();
    const { blockGroups, getBlockGroupList } = useBlockGroups();

    // get Division and BlockGroups
    useFetch(async () => {
      await getDivision(contestId, divisionId).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
      await getBlockGroupList(contestId, division.value).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
    });

    // update Division
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

    // create BlockGroup
    const bgLoading = ref(false);
    const dialog = ref(false);
    const { blockGroup, createBlockGroup } = useBlockGroup();
    const saveBlockGroup = async () => {
      const start = performance.now();
      dialog.value = false;

      if(division.value.ref === null) {
        error({statusCode: 500});
        throw new Error("ref of 'division' is not found");
      }
      blockGroup.value.divisionRef = division.value.ref;
      await createBlockGroup(contestId, blockGroup.value);

      // set new BlockGroup instance
      blockGroup.value = $reps.blockGroupRep.newModelInstance();

      const t = performance.now() - start;
      setTimeout(() => {
        bgLoading.value = false;
      }, 1000 - t);

      // reload BlockGroups
      await getBlockGroupList(contestId, division.value).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
    };

    return {
      contestId,
      division,
      divisionLoading,
      saveDivision,
      blockGroups,
      blockGroup,
      dialog,
      bgLoading,
      saveBlockGroup,
    };
  },
  head: {},
});
</script>

<style>
</style>