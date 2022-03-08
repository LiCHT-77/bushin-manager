<template>
  <v-list>
    <v-list-item-group>
      <v-divider></v-divider>
      <template v-for="(contest, index) in contests">
        <v-list-item :key="contest.id">
          <v-list-item-content>
            <v-list-item-title>{{ contest.name }}</v-list-item-title>
            <v-list-item-subtitle>{{
              $dateFns.format(contest.date, 'yyyy/MM/dd')
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider :key="index"></v-divider>
      </template>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { defineComponent, useFetch } from '@nuxtjs/composition-api';
import useContests from '~/composable/contests/useContests';

export default defineComponent({
  setup() {
    const { contests, getContestList } = useContests();

    useFetch(async () => {
        await getContestList();
    });

    return {
      contests
    };
  },
});
</script>

<style>
</style>