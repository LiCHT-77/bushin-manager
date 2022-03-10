<template>
  <v-container>
    <v-row>
      <h1>大会設定</h1>
    </v-row>
    <v-row>
      <v-col cols="12">
        <contest-form
          :contest-id="contestId"
          :loading="contestLoading"
          @save="saveContest($event)"
        ></contest-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-title>階級設定</v-card-title>
          <v-card-subtitle>
            ドラッグ&ドロップで表示順の並べ替えができます。
          </v-card-subtitle>
          <v-card-text>
            <division-setting-list
              :key="divListKey"
              :contest-id="contestId"
            ></division-setting-list>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              outlined
              @click="
                divFormKey++;
                dialog = true;
              "
            >
              階級を追加
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dialog" width="500">
          <division-form
            :key="divFormKey"
            :contest-id="contestId"
            :loading="divisionLoading"
            @save="saveDivision($event)"
          ></division-form>
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
import ContestForm from '~/components/contests/ContestForm.vue';
import useContest from '~/composable/contests/useContest';
import DivisionSettingList from '~/components/divisions/DivisionSettingList.vue';
import DivisionForm from '~/components/divisions/DivisionForm.vue';
import useDivision from '~/composable/divisions/useDivision';
import { Contest, Division } from '~/types/model';

export default defineComponent({
  components: {
    ContestForm,
    DivisionSettingList,
    DivisionForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会編集';

    // get contest id
    const route = useRoute();
    const contestId = route.value.params.contestId;

    // update Contest
    const { updateContest } = useContest();
    const contestLoading = ref(false);
    const saveContest = async (contest: Contest) => {
      contestLoading.value = true;
      const start = performance.now();
      await updateContest(contest.value);
      const t = performance.now() - start;
      setTimeout(() => {
        contestLoading.value = false;
      }, 1000 - t);
    };

    // create Division
    const { createDivision } = useDivision();
    const divisionLoading = ref(false);
    const dialog = ref(false);
    // rerender DivisionForm and DivisionList component when saved
    const divFormKey = ref(0);
    const divListKey = ref(0);

    const saveDivision = async (division: Division) => {
      const start = performance.now();
      dialog.value = false;
      await createDivision(contestId, division.value);
      const t = performance.now() - start;
      setTimeout(() => {
        divisionLoading.value = false;
        divListKey.value++;
      }, 1000 - t);
    };

    return {
      saveContest,
      contestId,
      contestLoading,
      divListKey,
      divFormKey,
      saveDivision,
      divisionLoading,
      dialog,
    };
  },
  head: {},
});
</script>

<style>
</style>