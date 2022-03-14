<template>
  <v-card>
    <v-form ref="divisionForm">
      <v-card-title>階級設定</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="divisionComputed.name"
          label="階級名"
          :rules="validations.name"
        ></v-text-field>
        <v-select
          v-model="divisionComputed.ranks"
          :items="ranks"
          :rules="validations.ranks"
          attach
          chips
          label="級/段"
          multiple
        ></v-select>
        <v-select
          v-model="divisionComputed.contestType"
          :items="contestTypes"
          :rules="validations.contestType"
          label="試合形式"
        ></v-select>
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
import { Division } from '~/models';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
  props: {
    division: {
      type: Object as () => Division,
      default: new Division(),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    // Division setup
    const ranks = [
      '8級',
      '7級',
      '6級',
      '5級',
      '4級',
      '3級',
      '2級',
      '1級',
      '初段',
      '2段',
      '3段',
      '4段',
    ];
    const contestTypes = ['通常', '3形合計'];

    const {division} = toRefs(props);
    const divisionComputed = computed({
      get: () => division.value,
      set: (val) => emit('update:division', val),
    });

    // validation rules
    const validations = {
      name: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
      ranks: [
        (value: string) =>
          value.length >= 1 || '級/段は1つ以上選択してください',
      ],
      contestTypes: [
        (value: string) => !!value || '試合形式を選択してください',
      ],
    };

    // save
    const divisionForm = ref<VForm>();
    const save = () => {
      if (divisionForm.value !== undefined && divisionForm.value.validate()) {
        emit('save');
      }
    };

    return {
      divisionForm,
      divisionComputed,
      ranks,
      contestTypes,
      validations,
      save,
    };
  },
});
</script>

<style>
</style>