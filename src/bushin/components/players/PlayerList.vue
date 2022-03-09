<template>
  <v-simple-table>
    <template #default>
      <thead>
        <th>氏名</th>
        <th>道場</th>
        <th>年齢</th>
        <th>級/段</th>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id" @click="console.log(player.id)">
          <td>{{ player.name }}</td>
          <td>{{ player.dojo }}</td>
          <td>{{ player.age }}</td>
          <td>{{ player.rank }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  props: {
    players: {
      type: Array,
      required: true,
    }
  }
});
</script>

<style>
</style>