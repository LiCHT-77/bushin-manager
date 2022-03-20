<template>
  <v-card>
    <v-form ref="blockForm" @submit.prevent>
      <v-card-title class="handle">{{
        blockComputed.name === '' ? '新ブロック' : blockComputed.name
      }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col>
              <v-text-field
                v-model="blockComputed.name"
                label="ブロック名"
                :rules="validations.name"
              ></v-text-field>
              <v-select
                v-model="blockComputed.advance"
                :items="selectBlocks"
                label="進出先ブロック"
                clearable
              ></v-select>
              <v-text-field
                v-model.number="blockComputed.referee"
                label="審判数"
                type="number"
                :rules="validations.referee"
              ></v-text-field>
              <v-text-field
                v-model.number="blockComputed.winner"
                label="勝者数"
                type="number"
                :rules="validations.winner"
              ></v-text-field>
              <v-subheader class="pl-0">前戦の合計点で並べ替えるか</v-subheader>
              <v-switch
                v-model="blockComputed.isPlayerOrder"
                class="mt-0"
              ></v-switch>
              <v-select
                v-if="blockComputed.isPlayerOrder"
                v-model="blockComputed.playerOrderDirection"
                label="並べ替え順序（前戦合計点）"
                :rules="validations.playerOrderDirection"
                :items="[
                  { value: 'asc', text: '昇順' },
                  { value: 'desc', text: '降順' },
                ]"
              ></v-select>
            </v-col>
            <v-col>
              <setting-list :items="[]" :draggable="block.id">
                <template #item-content="{ item }">
                  <v-list-title>{{ item.name }}/{{ item.dojo }}</v-list-title>
                </template>
              </setting-list>
            </v-col>
          </v-row>
        </v-container>
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
import {
  computed,
  defineComponent,
  inject,
  ref,
  toRefs,
} from '@nuxtjs/composition-api';
import { Block } from '~/models';
import SettingList from '~/components/SettingList.vue';
import { blockTreeKey } from '~/composable';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
  components: {
    SettingList,
  },
  props: {
    block: {
      type: Object as () => Block,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { block } = toRefs(props);
    const blockComputed = computed({
      get: () => block.value,
      set: (val) => emit('update:block', val),
    });

    const blockTree = inject(blockTreeKey);
    if (blockTree === undefined) {
      throw new Error("con't get block tree");
    }
    const selectBlocks = blockTree.flatBlocks;

    // validation rules
    const validations = {
      name: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
      advance: [
        //
      ],
      referee: [
        (value: number) => !!value || '必ず入力してください',
        (value: number) => value <= 5 || '5人で入力してください',
      ],
      winner: [
        (value: number) => !!value || '必ず入力してください',
        (value: number) => value <= 5 || '5人で入力してください',
      ],
      playerOrderDirection: [
        (value: string) =>
          !(block.value.isPlayerOrder && !value) || '必ず入力してください',
        (value: string) =>
          value in { asc: 'asc', desc: 'desc' } ||
          '昇順か降順で指定してください',
      ],
    };

    // save
    const blockForm = ref<VForm>();
    const save = () => {
      if (blockForm.value !== undefined && blockForm.value.validate()) {
        emit('save');
      }
    };
    return {
      blockComputed,
      selectBlocks,
      validations,
      blockForm,
      save,
    };
  },
});
</script>

<style>
</style>