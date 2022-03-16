<template>
  <setting-list
    :items.sync="blockGroupsComputed"
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
          name: 'setting-blockGroups-blockGroupId',
          params: { blockGroupId: item.id },
          query: { contestId: contestId },
        }"
        nuxt
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </setting-list>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api';
import { useBlockGroups } from '~/composable';
import SettingList from '~/components/SettingList.vue';
import { BlockGroup } from '~/models';

export default defineComponent({
  components: {
    SettingList,
  },
  props: {
    contestId: {
      type: String,
      required: true,
    },
    blockGroups: {
      type: Array as () => BlockGroup[],
      required: true,
    },
  },
  setup(props, { emit }) {
    const { contestId, blockGroups } = toRefs(props);
    const { updateOrders } = useBlockGroups();

    // Sort Division
    const onFlippedBlockGroup = async () => {
      await updateOrders(contestId.value, blockGroups.value);
    };

    const blockGroupsComputed = computed({
      get: () => blockGroups.value,
      set: (val) => {
        emit('update:blockGroups', val);
      },
    });

    return { onFlippedBlockGroup, blockGroupsComputed };
  },
});
</script>

<style>
</style>