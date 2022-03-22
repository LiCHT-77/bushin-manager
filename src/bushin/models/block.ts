import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";

export interface Winner {
    playerId: string;
    name: string;
    dojo: string;
    sum: number;
}

export class Block extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public name: string = '',
        public advance: string = '',
        public referee: number = 0,
        public winner: number = 0,
        public winners: Winner[] = [],
        public isPlayerOrder: boolean = false,
        public playerOrderDirection: string = 'asc',
        public order: number = 0,
        public divisionId: string = '',
        public blockGroupId: string = '',
    ) {
        super(id, ref);
    }
}