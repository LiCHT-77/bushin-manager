<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            Application
          </v-list-item-title>
          <v-list-item-subtitle>
            subtext
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-navigation-drawer>

    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>ApplicationA</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <Nuxt class="mt-3" />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  setup() {
    const drawer = ref(false);
    return {
      drawer,
    };
  },
});
</script>

<style>

</style>