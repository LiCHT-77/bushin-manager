<template>
  <v-card>
    <v-form ref="blockGroupForm" @submit.prevent>
      <v-card-title>ラウンド設定</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="blockGroupComputed.name"
          label="ラウンド名"
          :rules="validations.name"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="save()"
        >
          保存
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from '@nuxtjs/composition-api';
import { BlockGroup } from '~/models';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
  props: {
    blockGroup: {
      type: Object as () => BlockGroup,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const {blockGroup} = toRefs(props);
    const blockGroupComputed = computed({
      get: () => blockGroup.value,
      set: (val) => emit('update:blockGroup', val),
    });

    // validation rules
    const validations = {
      name: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
    };

    // save
    const blockGroupForm = ref<VForm>();
    const save = () => {
      if (
        blockGroupForm.value !== undefined &&
        blockGroupForm.value.validate()
      ) {
        emit('save');
      }
    };
    return {
      blockGroupComputed,
      validations,
      blockGroupForm,
      save,
    };
  },
});
</script>

<style>
</style>