import { Firestore } from "firebase/firestore";
import { AbstractRepository } from "./abstractRepository";
import { ContestCollectionKeys, ContestModel } from "~/models/contest";
import { Contest, ModelConstructor } from "~/types/model";
import { ContestRepository } from "~/types/repositories";

export class ContestRepositoryImp extends AbstractRepository<Contest, ContestCollectionKeys> implements ContestRepository {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Contest> = ContestModel,
        collectionName: string = 'contests',
    ) {
        super(firestore, modelConstructor, collectionName);
    }
}