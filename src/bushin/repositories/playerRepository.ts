import { Firestore } from "firebase/firestore";
import { Repository } from "./repository";
import { Player } from "~/models/player";
import { ModelConstructor } from "~/types/model";

declare const PlayerCollectionPathSym: unique symbol;

export type PlayerCollectionPath = string & { [PlayerCollectionPathSym]: never; };

export const isPlayerCollPath = (val: string): val is PlayerCollectionPath => /contests\/.*\/players/.test(val);

export class PlayerRepository extends Repository<Player, PlayerCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Player> = Player,
        collectionName: string = 'players',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(contestId: string): PlayerCollectionPath {
        return `contests/${contestId}/players` as PlayerCollectionPath;
    }
}