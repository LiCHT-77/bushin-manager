<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app temporary>
      <!--  -->
    </v-navigation-drawer>

    <v-app-bar app dark color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <Nuxt class="mt-3" />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api';
export default defineComponent({
  name: 'DefaultLayout',
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