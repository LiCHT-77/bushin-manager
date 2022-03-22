<template>
  <v-autocomplete
    v-model="playerId"
    :items="players"
    item-text="name"
    item-value="id"
    append-icon="mdi-plus"
    :loading="loading"
    @click:append="addPlayer"
    @focus="getPlayers"
  ></v-autocomplete>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api';
import { useContestId, useLoading, usePlayers } from '~/composable';

export default defineComponent({
  props: {
    divisionId: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const playerId = ref('');
    const { players, getDivisionPlayerList } = usePlayers();
    const { contestId } = useContestId();

    const { loadingSection } = useLoading();
    const loading = ref(false);
    const getPlayers = () => {
      if (players.value.length > 0) return;
      loadingSection(async () => {
        await getDivisionPlayerList(contestId, props.divisionId);
      }, loading);
    };

    const addPlayer = () => {
      const player = players.value.find((p) => p.id === playerId.value);
      if (player != null) {
        emit('add', player);
        playerId.value = '';
      }
    };

    return {
      playerId,
      players,
      getPlayers,
      loading,
      addPlayer,
    };
  },
});
</script>

<style>
</style>