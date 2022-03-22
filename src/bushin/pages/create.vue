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
import { defineComponent, inject, useMeta, useRouter } from '@nuxtjs/composition-api';
import ContestForm from '~/components/contests/ContestForm.vue';
import { snackbarStateKey, useContest, useSnackbarState } from '~/composable';

export default defineComponent({
  components: {
    ContestForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会作成';

    // create new Contest
    const snackbar = inject(snackbarStateKey, useSnackbarState());
    const { contest, createContest } = useContest();
    const router = useRouter();
    const saveContest = async () => {
      await createContest(contest.value).catch((err) => {
        snackbar.setSnackbar({
          text: '大会情報の保存に失敗しました。',
          color: 'error'
        });
        throw err;
      });
      router.push({ name: 'index' });
    };

    return { contest, saveContest };
  },
  head: {},
});
</script>

<style>
</style>