<template>
  <v-container>
    <v-row>
      <h1>大会作成</h1>
    </v-row>
    <v-row>
      <v-col cols="12">
        <contest-form @save="saveContest($event)"></contest-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, useMeta, useRouter } from "@nuxtjs/composition-api";
import ContestForm from "~/components/contests/ContestForm.vue";
import useContest from "~/composable/contests/useContest";

export default defineComponent({
  components: {
    ContestForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会作成';

    // create new Contest
    const {createContest} = useContest();
    const router = useRouter();
    const saveContest = async (contest) => {
      await createContest(contest.value);
      router.push({name: 'contests'});
    };

    return { saveContest };
  },
  head: {},
});
</script>

<style>
</style>