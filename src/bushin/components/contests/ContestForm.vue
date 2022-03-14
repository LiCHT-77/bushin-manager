<template>
  <v-card>
    <v-form ref="contestForm">
      <v-card-title> 基本設定 </v-card-title>
      <v-card-text>
        <p>{{ contest }}</p>
        <v-text-field
          v-model="contestComputed.name"
          label="大会名"
          :rules="validations.name"
        ></v-text-field>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="contestDate"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="contestDate"
              label="開催日時"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="contestDate" locale="ja" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
            <v-btn text color="primary" @click="$refs.menu.save(contestDate)">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
        <v-subheader class="pl-0">公開設定</v-subheader>
        <v-switch
          v-model="contestComputed.isPublish"
          :label="isPublishLabel"
          class="mt-0"
        ></v-switch>
        <p>各ラウンドで「試合完了」となった試合のみ公開されます。</p>
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
  ref,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api';
import { Contest } from '~/models';

export interface VForm {
  validate: () => boolean;
  reset: () => void;
  resetValidation: () => void;
}

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    contest: {
      type: Object as () => Contest,
      default: new Contest(),
    },
  },
  setup(props, { emit }) {
    // setup `Contest`
    const { contest } = toRefs(props);

    const contestComputed = computed({
      get: () => contest.value,
      set: (val) => {
        emit('update:contest', val);
      },
    });

    // format Date object
    const { $dateFns } = useContext();
    const dateFormat = 'yyyy-MM-dd';
    const contestDate = computed({
      get: () => $dateFns.format(contest.value.date, dateFormat),
      set: (val) => {
        contest.value.date = $dateFns.parse(val, dateFormat, new Date());
      },
    });

    // is_publish label
    const isPublishLabel = computed(() =>
      contest.value.isPublish ? '試合結果を公開する' : '試合結果を公開しない'
    );

    // validations
    const validations = {
      name: [
        (value: string) => !!value || '必ず入力してください',
        (value: string) => value.length <= 10 || '10文字以内で入力してください',
      ],
      date: [(value: string) => !!value || '必ず入力してください'],
    };

    // emit `save` event to parent component
    const contestForm = ref<VForm>();
    const save = () => {
      if (contestForm.value !== undefined && contestForm.value.validate()) {
        emit('save');
      }
    };

    // datepicker menu flag
    const menu = false;

    return {
      contestComputed,
      contestDate,
      isPublishLabel,
      validations,
      contestForm,
      save,
      menu,
    };
  },
});
</script>

<style>
</style>