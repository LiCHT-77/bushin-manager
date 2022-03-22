<template>
  <nuxt-child />
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  layout() {
    return 'setting';
  },
  setup() {},
});
</script>

<style>
</style>