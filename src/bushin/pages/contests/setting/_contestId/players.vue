<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>選手管理</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <player-list :players="players"></player-list>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <player-form
        :key="playerFormKey"
        :contest-id="contestId"
        :loading="playerLoading"
        @save="savePlayer($event)"
      ></player-form>
    </v-dialog>
  </v-container>
</template>

<script>
import { defineComponent, ref, useFetch, useRoute } from "@nuxtjs/composition-api";
import PlayerList from "~/components/players/PlayerList.vue";
import PlayerForm from "~/components/players/PlayerForm.vue";
import usePlayers from "~/composable/players/usePlayers";
import usePlayer from "~/composable/players/usePlayer";

export default defineComponent({
  components: {
    PlayerList,
    PlayerForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '選手管理';

    const route = useRoute();
    const contestId = route.value.params.contestId;

    // player list
    const { players, getPlayerList } = usePlayers();
    useFetch(async () => {
      await getPlayerList(contestId);
    });

    // create player
    const { createPlayer } = usePlayer();
    const playerFormKey = ref(0);
    const playerLoading = ref(false);
    const dialog = ref(false);
    const savePlayer = async (player) => {
      const start = performance.now();
      dialog.value = false;
      await createPlayer(contestId, player);
      const t = performance.now() - start;
      setTimeout(() => {
        playerLoading.value = false;
        playerFormKey.value++;
      }, 1000 - t);
    };

    return {
      players,
      playerFormKey,
      playerLoading,
      dialog,
      savePlayer,
    };
  },
  head: {},
});
</script>

<style>
</style>