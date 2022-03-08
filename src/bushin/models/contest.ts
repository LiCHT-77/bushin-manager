import { BaseModel } from "./abstractModel";
import { Contest } from "~/types/model";
import { CollectionKeys } from "~/types/repositories";

export interface ContestCollectionKeys extends CollectionKeys {}

export class ContestModel extends BaseModel implements Contest {
    constructor(
        id: string = '',
        public name: string = '',
        public date: Date = new Date(),
        public isPublish: boolean = false,
    ) {
        super(id);
    }
}
