import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";

export class Record extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public playerId: string = '',
        public name: string = '',
        public dojo: string = '',
        public kata: string = '',
        public points: Array<number> = [],
        public sum: number = 0,
        public previousSum: number = 0,
        public order: number = 0,
    ) {
        super(id, ref);
    }
}