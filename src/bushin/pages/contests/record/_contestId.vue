<template>
  <nuxt-child />
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  layout() {
    return 'record';
  },
  setup() {}
});
</script>

<style>
</style>