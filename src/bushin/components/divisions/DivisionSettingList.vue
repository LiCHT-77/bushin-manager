<template>
  <setting-list
    :items.sync="divisionsComputed"
    draggable="division"
    @flipped="onFlippedDivision($event)"
  >
    <template #item-content="{ item }">
      <v-list-item-title>
        {{ item.name }}
        <span v-for="(rank, index) in item.ranks" :key="index">
          <span v-if="index === 0"> : </span>
          <span v-else> / </span>
          {{ rank }}
        </span>
      </v-list-item-title>
    </template>
    <template #item-action="{ item }">
      <v-btn
        icon
        :to="{
          name: 'contests-setting-contestId-divisionId',
          params: { contestId: contestId, divisionId: item.id },
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
import SettingList from '~/components/SettingList.vue';
import { useDivisions } from '~/composable';
import { Division } from '~/models';

export default defineComponent({
  components: {
    SettingList,
  },
  props: {
    contestId: {
      type: String,
      required: true,
    },
    divisions: {
      type: Array as () => Division[],
      required: true,
    },
  },
  setup(props, { emit }) {
    const { contestId, divisions } = toRefs(props);
    const { updateOrders } = useDivisions();

    // Sort Division
    const onFlippedDivision = async () => {
      await updateOrders(contestId.value, divisions.value);
    };

    const divisionsComputed = computed({
      get: () => divisions.value,
      set: (val) => {
        emit('update:divisions', val);
      },
    });

    return { onFlippedDivision, divisionsComputed };
  },
});
</script>

<style>
.handle:hover {
  cursor: pointer;
}
</style>