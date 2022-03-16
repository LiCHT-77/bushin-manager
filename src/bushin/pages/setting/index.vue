<template>
  <v-container>
    <v-row>
      <h1>大会設定</h1>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          outlined
          color="primary"
          :to="{
            name: 'setting-players',
            query: { contestId },
          }"
          nuxt
          >選手管理</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <contest-form
          :contest.sync="contest"
          :loading="contestLoading"
          @save="saveContest()"
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
              :contest-id="contestId"
              :divisions.sync="divisions"
            ></division-setting-list>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" outlined @click="dialog = true">
              階級を追加
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-dialog v-model="dialog" width="500">
          <division-form
            :division.sync="division"
            :loading="divisionLoading"
            @save="saveDivision()"
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
  useContext,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import ContestForm from '~/components/contests/ContestForm.vue';
import DivisionSettingList from '~/components/divisions/DivisionSettingList.vue';
import DivisionForm from '~/components/divisions/DivisionForm.vue';
import { useContest, useDivision, useDivisions } from '~/composable';

export default defineComponent({
  components: {
    ContestForm,
    DivisionForm,
    DivisionSettingList,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会編集';

    // get contest id
    const route = useRoute();
    const { contest, getContest, updateContest } = useContest();
    const { divisions, getDivisionList } = useDivisions();
    const { $reps, error } = useContext();

    // get Contest an Divisions
    // get contestId from route query
    const contestId = route.value.query.contestId;
    if (typeof contestId !== 'string') {
      error({ statusCode: 404 });
      throw new Error("query parameter 'contestId' not found");
    }

    useFetch(async () => {
      await getContest(contestId).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
      await getDivisionList(contestId).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
    });

    // update Contest
    const contestLoading = ref(false);
    const saveContest = async () => {
      contestLoading.value = true;
      const start = performance.now();

      await updateContest(contest.value);

      const t = performance.now() - start;
      setTimeout(() => {
        contestLoading.value = false;
      }, 1000 - t);
    };

    // add Division
    const { division, createDivision } = useDivision();
    const dialog = ref(false);
    const divisionLoading = ref(false);

    const saveDivision = async () => {
      const start = performance.now();
      dialog.value = false;

      await createDivision(contestId, division.value);

      // set new Division instance
      division.value = $reps.divisionRep.newModelInstance();

      const t = performance.now() - start;
      setTimeout(() => {
        divisionLoading.value = false;
      }, 1000 - t);

      // reload Divisions
      await getDivisionList(contestId).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });
    };

    return {
      contestId,
      contest,
      contestLoading,
      saveContest,
      divisions,
      division,
      dialog,
      divisionLoading,
      saveDivision,
    };
  },
  head: {},
});
</script>

<style>
</style>