<template>
  <v-container>
    <v-row>
      <h1>大会作成</h1>
    </v-row>
    <v-row>
      <v-col cols="12">
        <contest-form :contest.sync="contest" @save="saveContest()"></contest-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useMeta, useRouter } from '@nuxtjs/composition-api';
import ContestForm from '~/components/contests/ContestForm.vue';
import { useContest } from '~/composable';

export default defineComponent({
  components: {
    ContestForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会作成';

    // create new Contest
    const { contest, createContest } = useContest();
    const router = useRouter();
    const saveContest = async () => {
      await createContest(contest.value);
      router.push({ name: 'index' });
    };

    return { contest, saveContest };
  },
  head: {},
});
</script>

<style>
</style>