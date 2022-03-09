import { BaseModel } from "./abstractModel";
import { Player, Rank } from "~/types/model";
import { CollectionKeys } from "~/types/repositories";

export interface PlayerCollectionKeys extends CollectionKeys {
    contests: string
}

export class PlayerModel extends BaseModel implements Player {
    constructor(
        id: string = '',
        public name: string = '',
        public dojo: string = '',
        public age: number = 0,
        public rank: Rank = '8級',
    ) {
        super(id);
    }
}
