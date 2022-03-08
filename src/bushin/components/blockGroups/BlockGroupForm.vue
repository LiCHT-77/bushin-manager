<template>
  <v-card>
    <v-form ref="blockGroupForm" @submit.prevent>
      <v-card-title>ラウンド設定</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="blockGroup.name"
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

<script>
import { defineComponent, ref, useFetch } from "@nuxtjs/composition-api";
import useBlockGroup from "~/composable/blockGroups/useBlockGroup";

export default defineComponent({
  props: {
    contestId: {
      type: String,
      required: true,
    },
    divisionId: {
      type: String,
      required: true,
    },
    blockGroupId: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  setup({ contestId, divisionId, blockGroupId }, { emit }) {
    const { blockGroup, getBlockGroup } = useBlockGroup();
    if (contestId !== '' && divisionId !== '' && blockGroupId !== '') {
      useFetch(async () => {
        await getBlockGroup(contestId, divisionId, blockGroupId);
      });
    }

    // validation rules
    const validations = {
      name: [
        value => !!value || "必ず入力してください",
        value => value.length <= 10 || "10文字以内で入力してください"
      ]
    };

    // save
    const blockGroupForm = ref(null);
    const save = () => {
      if (blockGroupForm.value.validate()) {
        emit('save', blockGroup);
      }
    };
    return {
      blockGroup,
      validations,
      blockGroupForm,
      save,
    };
  }
});
</script>

<style>
</style>