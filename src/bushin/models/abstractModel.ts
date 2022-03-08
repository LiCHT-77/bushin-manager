import { QueryDocumentSnapshot, SnapshotOptions, WithFieldValue, DocumentData, FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { Model, ModelConstructor } from "~/types/model";

export abstract class BaseModel implements Model {
    constructor(
        public readonly id: string
    ) { }

    static converter<U extends Model>(modelCtor: ModelConstructor<U>): FirestoreDataConverter<U> {
        return {
            fromFirestore(snapShot: QueryDocumentSnapshot, _options: SnapshotOptions): U {
                const data = snapShot.data();

                const model = new modelCtor(snapShot.id);

                for (const key in model) {
                    if (key === 'id') {
                        continue;
                    }

                    const snake = key.replace(/([A-Z])/g,
                        function (s) {
                            return '_' + s.charAt(0).toLowerCase();
                        });

                    if (Object.prototype.hasOwnProperty.call(data, snake) &&
                        Object.prototype.hasOwnProperty.call(model, key)
                    ) {

                        if(data[snake] instanceof Timestamp) {
                            data[snake] = data[snake].toDate();
                        }

                        if(typeof model[key] === typeof data[snake]) {
                            model[key] = data[snake];
                        } else {
                            throw new TypeError(`The type of property ${key} does not match.`);
                        }
                    } else {
                        throw new Error(`Property ${key} does not exist in the acquired data.`);
                    }
                }

                return model;
            },
            toFirestore(model: WithFieldValue<U>): DocumentData {
                const docData: { [key: string]: any; } = {};

                for (const key in model) {
                    if (key === 'id') {
                        continue;
                    }
                    const snake = key.replace(/([A-Z])/g,
                        function (s) {
                            return '_' + s.charAt(0).toLowerCase();
                        });

                    docData[snake] = model[key];
                }

                return docData;
            }
        };
    }
}