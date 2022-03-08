import { ref, useContext } from "@nuxtjs/composition-api";
import { PlayerCollectionKeys } from "~/models/player";
import { Player } from "~/types/model";


export default function usePlayers() {
    const { $reps } = useContext();
    const playerRep = $reps.playerRep;
    const players = ref<Player[]>([]);

    const getPlayerColKeys = (contestId: string): PlayerCollectionKeys => {
        return {
            contests: contestId
        };
    };

    const getPlayerList = async (contestId: string) => {
        players.value = await playerRep.getList(getPlayerColKeys(contestId));
    };

    return {
        players,
        getPlayerList
    };
}