import { ref, useContext } from "@nuxtjs/composition-api";
import { Player } from "~/models";
import { PlayerRepository } from "~/repositories";

export default function usePlayers() {
    const { $reps } = useContext();
    const playerRep = $reps.playerRep;
    const players = ref<Player[]>([]);

    const getPlayerList = async (contestId: string) => {
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        players.value = await playerRep.getList(collectionPath);
    };

    return {
        players,
        getPlayerList
    };
}