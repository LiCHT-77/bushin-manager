<template>
  <v-card>
    <v-form ref="playerForm">
      <v-card-title>選手詳細</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="player.name"
          label="選手名"
          :rules="validations.name"
        ></v-text-field>
        <v-text-field
          v-model="player.dojo"
          label="道場名"
          :rules="validations.dojo"
        ></v-text-field>
        <v-text-field
          v-model="player.age"
          label="年齢"
          :rules="validations.age"
          type="number"
        ></v-text-field>
        <v-select
          v-model="player.rank"
          :items="ranks"
          :rules="validations.rank"
          attach
          chips
          label="級/段"
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
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api';
import { usePlayer } from '~/composable';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
  props: {
    contestId: {
      type: String,
      required: true,
    },
    playerId: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup({ contestId, playerId }, { emit }) {
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
    const { player, getPlayer } = usePlayer();
    if (contestId !== '' && playerId !== '') {
      useFetch(async () => {
        await getPlayer(contestId, playerId);
      });
    }

    // validation rules
    const validations = {
      name: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
      dojo: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
      age: [(value: string) => !!value || '必ず入力してください'],
      rank: [(value: string) => !!value || '級/段は必ず選択してください'],
    };

    // save
    const playerForm = ref<VForm>();
    const save = () => {
      if (playerForm.value !== undefined && playerForm.value.validate()) {
        emit('save', player);
      }
    };

    return {
      playerForm,
      player,
      ranks,
      validations,
      save,
    };
  },
});
</script>

<style>
</style>