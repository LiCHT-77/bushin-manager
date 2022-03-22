<template>
  <div>
    <player-selector
      :division-id="block.divisionId"
      @add="addPlayer($event)"
    ></player-selector>
    <setting-list
      :items.sync="recordsComputed"
      :draggable="block.id"
      :disabled="block.isPlayerOrder"
      @flipped="onFlippedRecord($event)"
    >
      <template #item-content="{ item }">
        <v-list-item-title>{{ item.name }}/{{ item.dojo }}</v-list-item-title>
      </template>
      <template #item-action="{ item }">
        <v-dialog v-model="confirmDialog" :retain-focus="false" width="500">
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>レコード情報削除</v-card-title>
            <v-card-text>
              <h3>本当に削除しますか？</h3>
              <p class="red--text">
                選手の該当ブロックでの点数記録も削除されます。
              </p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="confirmDialog = false">
                キャンセル
              </v-btn>
              <v-btn color="error" text @click="deletePlayerRecord(item.id)">
                削除
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </setting-list>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from '@nuxtjs/composition-api';
import SettingList from '~/components/SettingList.vue';
import PlayerSelector from '~/components/blocks/PlayerSelector.vue';
import { Block, Player, Record } from '~/models';
import { useContestId, useRecords } from '~/composable';

export default defineComponent({
  components: {
    SettingList,
    PlayerSelector,
  },
  props: {
    block: {
      type: Object as () => Block,
      required: true,
    },
    records: {
      type: Array as () => Record[],
      required: true,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { block, records, confirm } = toRefs(props);
    const { contestId } = useContestId();
    const { updateOrders } = useRecords();

    const recordsComputed = computed({
      get: () => records.value,
      set: (val) => emit('update:record', val),
    });

    const confirmDialog = computed({
      get: () => confirm.value,
      set: (val) => {
        emit('update:confirm', val);
      },
    });

    const addPlayer = (player: Player) => {
      emit('addPlayer', player);
    };

    const deletePlayerRecord = (recordId: string) => {
      emit('deleteRecord', recordId);
    };

    const onFlippedRecord = async () => {
      await updateOrders(contestId, block.value.id, records.value);
    };

    return {
      recordsComputed,
      confirmDialog,
      addPlayer,
      onFlippedRecord,
      deletePlayerRecord,
    };
  },
});
</script>

<style>
</style>