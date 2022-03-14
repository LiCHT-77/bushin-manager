import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";
import { ContestType, Rank } from "~/types/model";

export class Division extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public name: string = '',
        public ranks: Array<Rank> = [],
        public contestType: ContestType = '通常',
        public order: number = 0,
    ) {
        super(id, ref);
    }
}
