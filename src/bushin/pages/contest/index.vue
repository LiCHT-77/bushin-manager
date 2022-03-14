<template>
  <v-container fluid class="px-16">
    <v-row>
      <v-col cols="12">
        <h1>大会一覧</h1>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12" class="d-flex align-center">
        <v-btn
          outlined
          small
          color="primary"
          :to="{ name: 'contests-create' }"
          nuxt
          >新大会の作成<v-icon>mdi-plus</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12">
        <contest-list></contest-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useMeta } from '@nuxtjs/composition-api';
import ContestList from '~/components/contests/ContestList.vue';
export default defineComponent({
  components: {
    ContestList,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '大会一覧';
    return {};
  },
  head: {},
});
</script>

<style>
</style>