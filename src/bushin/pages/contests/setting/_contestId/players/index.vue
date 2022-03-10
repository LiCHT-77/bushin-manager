<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>選手管理</h1>
      </v-col>
    </v-row>
    <v-row class="mt-0">
      <v-col cols="12" class="d-flex align-center">
        <v-btn outlined small color="primary" @click="playerFormOpen()">
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
        :key="playerFormKey"
        :contest-id="contestId"
        :loading="playerLoading"
        @save="savePlayer($event)"
      ></player-form>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useFetch,
  useMeta,
  useRoute,
  useRouter,
} from '@nuxtjs/composition-api';
import PlayerList from '~/components/players/PlayerList.vue';
import PlayerForm from '~/components/players/PlayerForm.vue';
import usePlayers from '~/composable/players/usePlayers';
import usePlayer from '~/composable/players/usePlayer';
import { Player } from '~/types/model';

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
    const playerLoading = ref(false);
    const dialog = ref(false);
    const savePlayer = async (player: Player) => {
      const start = performance.now();
      dialog.value = false;
      await createPlayer(contestId, player.value);
      const t = performance.now() - start;
      setTimeout(() => {
        playerLoading.value = false;
      }, 1000 - t);
    };

    const playerFormKey = ref(0);
    const playerFormOpen = () => {
      playerFormKey.value++;
      dialog.value = true;
    };

    const router = useRouter();
    const selectPlayer = (playerId: string) => {
      router.push({
        name: 'contests-setting-contestId-players-playerId',
        params: { contestId, playerId },
      });
    };

    return {
      players,
      contestId,
      playerFormKey,
      playerLoading,
      dialog,
      savePlayer,
      playerFormOpen,
      selectPlayer,
    };
  },
  head: {},
});
</script>

<style>
</style>