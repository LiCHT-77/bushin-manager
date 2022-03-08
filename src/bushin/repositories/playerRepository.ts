import { Firestore } from "firebase/firestore";
import { AbstractRepository } from "./abstractRepository";
import { PlayerCollectionKeys, PlayerModel } from "~/models/player";
import { Player, ModelConstructor } from "~/types/model";
import { PlayerRepository } from "~/types/repositories";

export class PlayerRepositoryImp extends AbstractRepository<Player, PlayerCollectionKeys> implements PlayerRepository {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Player> = PlayerModel,
        collectionName: string = 'players',
    ) {
        super(firestore, modelConstructor, collectionName);
    }
}