import { ref, useContext } from "@nuxtjs/composition-api";
import { PlayerCollectionKeys } from "~/models/player";
import { Player } from "~/types/model";

export default function usePlayer() {
    const { $reps } = useContext();
    const playerRep = $reps.playerRep;
    const player = ref<Player>(playerRep.newModelInstance());

    const getPlayerColKeys = (contestId: string): PlayerCollectionKeys => {
        return {
            contests: contestId
        };
    };

    const getPlayer = async (contestId: string, playerId: string) => {
        player.value = await playerRep.find(getPlayerColKeys(contestId), playerId);
    };

    const createPlayer = async (contestId: string, player: Player) => {
        await playerRep.add(getPlayerColKeys(contestId), player);
    };

    const updatePlayer = async (contestId: string, player: Player) => {
        await playerRep.update(getPlayerColKeys(contestId), player);
    };

    return {
        player,
        getPlayer,
        createPlayer,
        updatePlayer,
    };
}