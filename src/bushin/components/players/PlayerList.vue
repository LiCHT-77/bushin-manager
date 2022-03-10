<template>
  <v-simple-table>
    <template #default>
      <thead>
        <th class="text-left">氏名</th>
        <th class="text-left">道場</th>
        <th class="text-left">年齢</th>
        <th class="text-left">級/段</th>
      </thead>
      <tbody>
        <tr
          v-for="player in players"
          :key="player.id"
          @click="selectPlayer(player.id)"
        >
          <td>{{ player.name }}</td>
          <td>{{ player.dojo }}</td>
          <td>{{ player.age }}</td>
          <td>{{ player.rank }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  props: {
    players: {
      type: Array,
      required: true,
    },
  },
  setup(_, { emit }) {
    const selectPlayer = (playerId: string) => emit('select', playerId);
    return {
      selectPlayer,
    };
  },
});
</script>

<style>
</style>