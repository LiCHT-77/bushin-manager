<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>ラウンド設定</h1>
        <setting-breadcrumbs></setting-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <block-group-form
          :contest-id="contestId"
          :division-id="divisionId"
          :block-group-id="blockGroupId"
          :loading="bgLoading"
        ></block-group-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent, ref, useMeta, useRoute } from "@nuxtjs/composition-api";
import BlockGroupForm from "~/components/blockGroups/BlockGroupForm.vue";
import SettingBreadcrumbs from "~/components/SettingBreadcrumbs.vue";

export default defineComponent({
  components: {
    BlockGroupForm,
    SettingBreadcrumbs,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = 'ラウンド編集';

    // setup
    const route = useRoute();
    const contestId = route.value.params.contestId;
    const divisionId = route.value.params.divisionId;
    const blockGroupId = route.value.params.blockGroupId;

    const bgLoading = ref(false);

    return {
      contestId,
      divisionId,
      blockGroupId,
      bgLoading,
    };
  },
  head: {},
});
</script>

<style>
</style>