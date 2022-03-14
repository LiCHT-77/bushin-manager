import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";
import { Rank } from "~/types/model";

export class Player extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public name: string = '',
        public dojo: string = '',
        public age: number = 0,
        public rank: Rank = '8級',
    ) {
        super(id, ref);
    }
}
