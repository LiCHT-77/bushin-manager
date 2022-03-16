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
      <v-snackbar v-model="snackbar.state.active" right top absolute>
        {{ snackbar.state.text }}
      </v-snackbar>
      <Nuxt class="mt-3" />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, inject, provide, ref } from '@vue/composition-api';
import { snackbarStateKey, useSnackbarState } from '~/composable';

export default defineComponent({
  name: 'DefaultLayout',
  setup() {
    const drawer = ref(false);

    provide(snackbarStateKey, useSnackbarState());
    const snackbar = inject(snackbarStateKey);
    if (snackbar === undefined) {
      throw new Error("con't get snackbar");
    }

    return {
      drawer,
      snackbar,
    };
  },
});
</script>

<style>
</style>