import { ref, useContext } from "@nuxtjs/composition-api";
import { where } from "firebase/firestore";
import { Player } from "~/models";
import { DivisionRepository, PlayerRepository } from "~/repositories";

export default function usePlayers() {
    const { $reps } = useContext();
    const playerRep = $reps.playerRep;
    const players = ref<Player[]>([]);

    const getPlayerList = async (contestId: string) => {
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        players.value = await playerRep.getList(collectionPath);
    };

    const getDivisionPlayerList = async (contestId: string, divisionId: string) => {
        const division = await $reps.divisionRep.find(DivisionRepository.getCollectionPath(contestId), divisionId);
        const collectionPath = PlayerRepository.getCollectionPath(contestId);
        const q = where('rank', 'in', division.ranks);
        players.value = await playerRep.getList(collectionPath, [q]);
    };

    return {
        players,
        getPlayerList,
        getDivisionPlayerList,
    };
}