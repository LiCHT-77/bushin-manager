<template>
  <v-card>
    <v-form ref="blockForm" @submit.prevent>
      <v-card-title class="handle">{{
        blockComputed.name === '' ? '新ブロック' : blockComputed.name
      }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="blockComputed.name"
                label="ブロック名"
                :rules="validations.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="blockComputed.advance"
                :items="selectBlocks"
                label="進出先ブロック"
                append-icon="mdi-close"
                @click:append="blockComputed.advance = ''"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="blockComputed.referee"
                label="審判数"
                type="number"
                :rules="validations.referee"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="blockComputed.winner"
                label="勝者数"
                type="number"
                :rules="validations.winner"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-switch
                v-model="blockComputed.isPlayerOrder"
                :label="
                  blockComputed.isPlayerOrder
                    ? '前戦の点数で並べ替える'
                    : '前戦の点数で並べ替えない'
                "
              ></v-switch>
            </v-col>
            <v-col cols="6">
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
        <v-btn
          v-if="block.id !== ''"
          color="secondary"
          outlined
          nuxt
          :to="{
            name: 'setting-blocks-blockId',
            params: { blockId: block.id },
            query: { contestId },
          }"
          >出場選手</v-btn
        >
        <v-spacer></v-spacer>
        <v-dialog v-model="confirmDialog" :retain-focus="false" width="500">
          <template #activator="{ on, attrs }">
            <v-btn color="error" outlined v-bind="attrs" v-on="on">削除</v-btn>
          </template>
          <v-card>
            <v-card-title>ブロック情報削除</v-card-title>
            <v-card-text>
              <h3>本当に削除しますか？</h3>
              <p class="red--text">
                該当ブロックでの点数記録も参照できなくなります。
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="confirmDialog = false">
                キャンセル
              </v-btn>
              <v-btn color="error" text @click="$emit('delete', block.id)">
                削除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { blockTreeKey, useContestId } from '~/composable';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
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
    const { contestId } = useContestId();
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

    const confirmDialog = ref(false);

    return {
      contestId,
      blockComputed,
      selectBlocks,
      validations,
      blockForm,
      save,
      confirmDialog,
    };
  },
});
</script>

<style>
</style>