import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";

export class BlockGroup extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public name: string = '',
        public isFinished: boolean = false,
        public order: number = 0,
        public divisionId: string = '',
    ) {
        super(id, ref);
    }
}
