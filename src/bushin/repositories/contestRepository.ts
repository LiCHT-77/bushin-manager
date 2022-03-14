import { Firestore } from "firebase/firestore";
import { Repository } from "./repository";
import { Contest } from "~/models/contest";
import { ModelConstructor } from "~/types/model";

declare const ContestCollectionPathSym: unique symbol;

export type ContestCollectionPath = string & { [ContestCollectionPathSym]: never; };

export const isContestCollPath = (val: string): val is ContestCollectionPath => /contests/.test(val);

export class ContestRepository extends Repository<Contest, ContestCollectionPath> {
    constructor(
        firestore: Firestore,
        modelConstructor: ModelConstructor<Contest> = Contest,
        collectionName: string = 'contests',
    ) {
        super(firestore, modelConstructor, collectionName);
    }

    static getCollectionPath(): ContestCollectionPath {
        return 'contests' as ContestCollectionPath;
    }
}