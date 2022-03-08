<template>
  <v-card>
    <v-form ref="divisionForm">
      <v-card-title>階級設定</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="division.name"
          label="階級名"
          :rules="validations.name"
        ></v-text-field>
        <v-select
          v-model="division.ranks"
          :items="ranks"
          :rules="validations.ranks"
          attach
          chips
          label="級/段"
          multiple
        ></v-select>
        <v-select
          v-model="division.contestType"
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
<script>
import { defineComponent, ref, useFetch } from "@nuxtjs/composition-api";
import useDivision from "~/composable/divisions/useDivision";

export default defineComponent({
  props: {
    contestId: {
      type: String,
      required: true,
    },
    divisionId: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  setup({ contestId, divisionId }, { emit }) {
    // Division setup
    const ranks = ['8級', '7級', '6級', '5級', '4級', '3級', '2級', '1級', '初段', '2段', '3段', '4段'];
    const contestTypes = ['通常', '3形合計'];
    const { division, getDivision } = useDivision();
    if (contestId !== '' && divisionId !== '') {
      useFetch(async () => {
        await getDivision(contestId, divisionId);
      });
    }

    // validation rules
    const validations = {
      name: [
        value => !!value || "必ず入力してください",
        value => value.length <= 10 || "10文字以内で入力してください"
      ],
      ranks: [
        value => value.length >= 1 || "級/段は1つ以上選択してください"
      ],
      contestTypes: [
        value => !!value || "試合形式を選択してください",
      ]
    };

    // save
    const divisionForm = ref(null);
    const save = () => {
      if (divisionForm.value.validate()) {
        emit('save', division);
      }
    };

    return {
      divisionForm,
      division,
      ranks,
      contestTypes,
      validations,
      save,
    };
  }
});
</script>

<style>
</style>