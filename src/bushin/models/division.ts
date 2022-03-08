import { BaseModel } from "./abstractModel";
import { ContestType, Division, Rank } from "~/types/model";
import { CollectionKeys } from "~/types/repositories";

export interface DivisionCollectionKeys extends CollectionKeys {
    contests: string;
}

export class DivisionModel extends BaseModel implements Division {
    constructor(
        id: string = '',
        public name: string = '',
        public ranks: Array<Rank> = [],
        public contestType: ContestType = '通常',
        public order: number = 0,
    ) {
        super(id);
    }
}
