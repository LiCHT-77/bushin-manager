<template>
  <setting-list
    :items.sync="divisions"
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

<script>
import { defineComponent, useFetch } from "@nuxtjs/composition-api";
import useDivisions from "~/composable/divisions/useDivisions";
import SettingList from "~/components/SettingList.vue";

export default defineComponent({
  components: {
    SettingList,
  },
  props: {
    contestId: {
      type: String,
      required: true,
    }
  },
  setup({ contestId }) {
    const { divisions, getDivisionList, updateOrders } = useDivisions();
    if (contestId !== '') {
      useFetch(async () => {
        await getDivisionList(contestId);
      });
    }

    // Sort Division
    const onFlippedDivision = async () => {
      await updateOrders(contestId);
    };

    return { divisions, onFlippedDivision };
  }
});
</script>

<style>
.handle:hover {
  cursor: pointer;
}
</style>