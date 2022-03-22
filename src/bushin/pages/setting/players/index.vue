<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>選手管理</h1>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12" class="d-flex align-center">
        <v-btn outlined small color="primary" @click="dialog = true">
          選手追加<v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <player-list
          :players="players"
          @select="selectPlayer($event)"
        ></player-list>
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" width="500">
      <player-form
        :player.sync="player"
        :loading="playerLoading"
        @save="savePlayer()"
      ></player-form>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  ref,
  useFetch,
  useMeta,
  useRouter,
} from '@nuxtjs/composition-api';
import PlayerList from '~/components/players/PlayerList.vue';
import PlayerForm from '~/components/players/PlayerForm.vue';
import {
  usePlayers,
  usePlayer,
  snackbarStateKey,
  useSnackbarState,
  useContestId,
} from '~/composable';

export default defineComponent({
  components: {
    PlayerList,
    PlayerForm,
  },
  setup() {
    // meta
    const { title } = useMeta();
    title.value = '選手管理';

    const { contestId } = useContestId();

    // player list
    const { players, getPlayerList } = usePlayers();
    const { fetch } = useFetch(async () => {
      await getPlayerList(contestId);
    });

    // create player
    const { player } = usePlayer();
    const { createPlayer } = usePlayer();
    const playerLoading = ref(false);
    const dialog = ref(false);
    const state = inject(snackbarStateKey, useSnackbarState());
    const savePlayer = async () => {
      const start = performance.now();
      dialog.value = false;

      await createPlayer(contestId, player.value).catch((err) => {
        state.setSnackbar({
          text: '選手作成を失敗しました。',
          color: 'error',
        });

        throw err;
      });

      const t = performance.now() - start;
      setTimeout(() => {
        playerLoading.value = false;
      }, 1000 - t);

      fetch();
    };

    const router = useRouter();
    const selectPlayer = (playerId: string) => {
      router.push({
        name: 'setting-players-playerId',
        params: { playerId },
        query: { contestId },
      });
    };

    return {
      players,
      player,
      playerLoading,
      dialog,
      savePlayer,
      selectPlayer,
    };
  },
  head: {},
});
</script>

<style>
</style>