import { DocumentReference } from "firebase/firestore";
import { Model } from "./model";

export class Contest extends Model {
    constructor(
        id: string = '',
        ref: DocumentReference | null = null,
        public name: string = '',
        public date: Date = new Date(),
        public isPublish: boolean = false,
    ) {
        super(id, ref);
    }
}
