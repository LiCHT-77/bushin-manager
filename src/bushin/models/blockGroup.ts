import { BaseModel } from "./abstractModel";
import { BlockGroup } from "~/types/model";
import { CollectionKeys } from "~/types/repositories";

export interface BlockGroupCollectionKeys extends CollectionKeys {
    contests: string;
    divisions: string;
}

export class BlockGroupModel extends BaseModel implements BlockGroup {
    constructor(
        id: string = '',
        public name: string = '',
        public isFinished: boolean = false,
        public order: number = 0,
    ) {
        super(id);
    }
}
