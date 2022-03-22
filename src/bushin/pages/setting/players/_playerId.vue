<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>選手詳細</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <player-form
          :player.sync="player"
          :loading="playerLoading"
          @save="savePlayer($event)"
        ></player-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useMeta,
  useRoute,
} from '@nuxtjs/composition-api';
import PlayerForm from '~/components/players/PlayerForm.vue';
import { useContestId, usePlayer } from '~/composable';

export default defineComponent({
  components: {
    PlayerForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '選手管理';

    const route = useRoute();
    const { contestId } = useContestId();
    const playerId = route.value.params.playerId;
    const { player, getPlayer, updatePlayer } = usePlayer();

    useFetch(async () => {
      await getPlayer(contestId, playerId);
    });

    const playerLoading = ref(false);
    const savePlayer = async () => {
      playerLoading.value = true;
      const start = performance.now();
      await updatePlayer(contestId, player.value);
      const t = performance.now() - start;
      setTimeout(() => {
        playerLoading.value = false;
      }, 1000 - t);
    };

    return {
      player,
      playerLoading,
      savePlayer,
    };
  },
  head: {},
});
</script>

<style>
</style>