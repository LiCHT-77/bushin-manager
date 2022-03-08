<template>
  <v-breadcrumbs :items="items" class="p-0">
    <template #item="{ item }">
      <v-breadcrumbs-item
        :to="item.link"
        :disabled="item.disabled"
        :exact="item.exact"
        nuxt
      >
        {{ item.text }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { defineComponent, useRoute } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const routes = {
      'contests-setting-contestId': {
        parents: [],
        param: ['contestId'],
        text: '大会設定',
      },
      'contests-setting-contestId-divisionId': {
        parents: ['contests-setting-contestId'],
        param: ['contestId', 'divisionId'],
        text: '階級設定',
      },
      'contests-setting-contestId-divisionId-blockGroupId': {
        parents: ['contests-setting-contestId', 'contests-setting-contestId-divisionId'],
        param: ['contestId', 'divisionId', 'blockGroupId'],
        text: 'ラウンド設定'
      },
    };


    const items = [];
    const route = useRoute();
    const thisRoute = routes[route.value.name];
    const genRouteObj = (name) => {
      const link = { name };
      const paramNames = routes[name].param;
      const params = {};
      for (const param of paramNames) {
        params[param] = route.value.params[param];
      }
      link.params = params;
      return {
        link,
        text: routes[name].text,
        disabled: false,
        exact: true,
      };
    };
    if (thisRoute !== undefined) {
      for (const parent of thisRoute.parents) {
        items.push(genRouteObj(parent));
      }
      items.push(genRouteObj(route.value.name));
    }
    return { items };
  }
});
</script>

<style>
</style>