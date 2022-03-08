<template>
  <v-list>
    <draggable
      v-model="itemComputed"
      :draggable="`.${draggable}`"
      handle=".handle"
      :animation="200"
      @end="emit('flipped', $event)"
    >
      <template v-for="item in itemComputed">
        <v-list-item :key="item.id" :class="draggable">
          <v-list-item-avatar class="handle">
            <v-icon>mdi-drag-horizontal-variant</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <slot name="item-content" :item="item"></slot>
          </v-list-item-content>
          <v-list-item-action>
            <slot name="item-action" :item="item"></slot>
          </v-list-item-action>
        </v-list-item>
      </template>
    </draggable>
  </v-list>
</template>

<script>
import { computed, defineComponent, toRefs } from "@nuxtjs/composition-api";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    draggable
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    draggable: {
      type: String,
      required: true
    },
  },
  emits: [
    'update:items',
    'flipped'
  ],
  setup(props, {emit}) {
    const { items } = toRefs(props);
    const itemComputed = computed({
      get: () => items.value,
      set: (val) => {
        emit('update:items', val);
      }
    });
    return {
      itemComputed,
      emit
    };
  }
});
</script>

<style>
</style>