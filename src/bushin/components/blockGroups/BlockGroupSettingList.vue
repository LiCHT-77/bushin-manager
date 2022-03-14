<template>
  <setting-list
    :items.sync="blockGroups"
    draggable="block-group"
    @flipped="onFlippedBlockGroup($event)"
  >
    <template #item-content="{ item }">
      <v-list-item-title>
        {{ item.name }}
      </v-list-item-title>
    </template>
    <template #item-action="{ item }">
      <v-btn
        icon
        :to="{
          name: 'contests-setting-contestId-divisionId-blockGroupId',
          params: {
            contestId: contestId,
            divisionId: divisionId,
            blockGroupId: item.id,
          },
        }"
        nuxt
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </setting-list>
</template>

<script lang="ts">
import { defineComponent, useFetch } from '@nuxtjs/composition-api';
import { useBlockGroups } from '~/composable';
import SettingList from '~/components/SettingList.vue';

export default defineComponent({
  components: {
    SettingList,
  },
  props: {
    contestId: {
      type: String,
      required: true,
    },
    divisionId: {
      type: String,
      required: true,
    },
  },
  setup({ contestId, divisionId }) {
    const { blockGroups, getBlockGroupList, updateOrders } = useBlockGroups();
    if (contestId !== '' && divisionId !== '') {
      useFetch(async () => {
        await getBlockGroupList(contestId);
      });
    }

    // Sort Division
    const onFlippedBlockGroup = async () => {
      await updateOrders(contestId, []);
    };

    return { blockGroups, onFlippedBlockGroup };
  },
});
</script>

<style>
</style>