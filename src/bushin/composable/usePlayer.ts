import { ref, useContext } from "@nuxtjs/composition-api";
import { Player } from "~/models";
import { PlayerRepository } from "~/repositories";

export default function usePlayer() {
    const { $reps } = useContext();
    const playerRep = $reps.playerRep;
    const player = ref<Player>(playerRep.newModelInstance());

    const getPlayer = async (contestId: string, playerId: string) => {
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        player.value = await playerRep.find(collectionPath, playerId);
    };

    const createPlayer = async (contestId: string, player: Player) => {
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        await playerRep.add(collectionPath, player);
    };

    const updatePlayer = async (contestId: string, player: Player) => {
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        await playerRep.update(collectionPath, player);
    };

    return {
        player,
        getPlayer,
        createPlayer,
        updatePlayer,
    };
}