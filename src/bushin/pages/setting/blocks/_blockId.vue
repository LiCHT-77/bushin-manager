<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>{{ block.name }} 出場選手管理</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <record-setting-list
          :block="block"
          :records.sync="records"
          :confirm.sync="dialog"
          @addPlayer="addPlayer($event)"
          @deleteRecord="deletePlayerRecord($event)"
        ></record-setting-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
  useRoute,
} from '@nuxtjs/composition-api';
import { useBlock, useContestId, useRecord, useRecords } from '~/composable';
import RecordSettingList from '~/components/records/RecordSettingList.vue';
import { Player } from '~/models';

export default defineComponent({
  components: {
    RecordSettingList,
  },
  setup() {
    const { contestId } = useContestId();
    const route = useRoute();
    const { error } = useContext();
    const blockId = route.value.params.blockId;

    const { block, getBlock } = useBlock();
    const { records, getRecordList } = useRecords();
    useFetch(async () => {
      await getBlock(contestId, blockId).catch((err) => {
        error({ statusCode: 404 });
        throw err;
      });

      await getRecordList(contestId, blockId).catch((err) => {
        error({ statusCode: 500 });
        throw err;
      });
    });

    const { $reps } = useContext();
    const { createRecord, deleteRecord } = useRecord();
    const addPlayer = async (player: Player) => {
      const newRecord = $reps.recordRep.newModelInstance();
      newRecord.playerId = player.id;
      newRecord.name = player.name;
      newRecord.dojo = player.dojo;
      await createRecord(contestId, block.value.id, newRecord);
      await getRecordList(contestId, blockId).catch((err) => {
        error({ statusCode: 500 });
        throw err;
      });
    };

    const dialog = ref(false);
    const deletePlayerRecord = async (recordId: string) => {
      await deleteRecord(contestId, block.value.id, recordId);
      await getRecordList(contestId, blockId).catch((err) => {
        error({ statusCode: 500 });
        throw err;
      });
      dialog.value = false;
    };

    return {
      block,
      records,
      addPlayer,
      deletePlayerRecord,
      dialog,
    };
  },
});
</script>

<style>
</style>