<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>大会</h1>
        <v-btn :to="settingLink">設定</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api';

export default defineComponent({
  setup() {
    const route = useRoute();
    const settingLink = {
      name: 'contests-setting-contestId',
      params: { contestId: route.value.params.contestId },
    };

    return {
      settingLink,
    };
  },
});
</script>

<style>
</style>