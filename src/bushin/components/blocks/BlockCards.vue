<template>
  <v-container>
    <draggable
      v-model="blocksComputed"
      draggable=".block"
      handle=".handle"
      :animation="200"
      tag="v-row"
      :disabled="dragDisabled"
      @end="onFlippedBlock()"
    >
      <v-col
        v-for="(block, index) in blocksComputed"
        :key="index"
        class="block"
        sm="12"
        md="6"
        lg="6"
        xl="6"
      >
        <block-form
          :block.sync="blocksComputed[index]"
          :loading="formLoading"
          @save="$emit('save', index)"
        ></block-form>
      </v-col>
    </draggable>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api';
import draggable from 'vuedraggable';
import BlockForm from '~/components/blocks/BlockForm.vue';
import { useBlocks } from '~/composable';
import { Block } from '~/models';

export default defineComponent({
  components: {
    draggable,
    BlockForm,
  },
  props: {
    contestId: {
      type: String,
      required: true,
    },
    blocks: {
      type: Array as () => Block[],
      required: true,
    },
    formLoading: {
      type: Boolean,
      default: false,
    },
    dragDisabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { contestId, blocks } = toRefs(props);
    const blocksComputed = computed({
      get: () => blocks.value,
      set: (val) => {
        emit('update:blocks', val);
      },
    });

    // sort blocks
    const { updateOrders } = useBlocks();
    const onFlippedBlock = async () => {
      await updateOrders(contestId.value, blocks.value);
    };

    return {
      blocksComputed,
      onFlippedBlock,
    };
  },
});
</script>

<style>
</style>