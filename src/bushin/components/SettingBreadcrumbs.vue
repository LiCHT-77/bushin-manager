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

<script lang="ts">
import { defineComponent, useRoute } from '@nuxtjs/composition-api';

export interface routeInfo {
  parents: Array<string>;
  params: Array<string>;
  text: string;
  [key: string]: any;
}

export interface routeInfos {
  [key: string]: routeInfo;
}

export interface routeObj {
  name: string;
  params?: object;
}

export interface linkItem {
  link: routeObj;
  text: string;
  disabled: boolean;
  exact: boolean;
}

export default defineComponent({
  setup() {
    const routes: routeInfos = {
      'contests-setting-contestId': {
        parents: [],
        params: ['contestId'],
        text: '大会設定',
      },
      'contests-setting-contestId-divisionId': {
        parents: ['contests-setting-contestId'],
        params: ['contestId', 'divisionId'],
        text: '階級設定',
      },
      'contests-setting-contestId-divisionId-blockGroupId': {
        parents: [
          'contests-setting-contestId',
          'contests-setting-contestId-divisionId',
        ],
        params: ['contestId', 'divisionId', 'blockGroupId'],
        text: 'ラウンド設定',
      },
    };

    const items = [];
    const route = useRoute();
    const routeName = route.value.name;

    const genItem = (name: string): linkItem => {
      const paramNames = routes[name].params;
      const params: { [key: string]: string } = {};
      for (const param of paramNames) {
        params[param] = route.value.params[param];
      }

      const link: routeObj = { name };
      link.params = params;
      return {
        link,
        text: routes[name].text,
        disabled: false,
        exact: true,
      };
    };

    if (routeName !== undefined && routeName !== null) {
      const thisRoute = routes[routeName];
      for (const parent of thisRoute.parents) {
        items.push(genItem(parent));
      }
      items.push(genItem(routeName));
    }

    return { items };
  },
});
</script>

<style>
</style>