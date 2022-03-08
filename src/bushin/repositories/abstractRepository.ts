import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, QueryConstraint, setDoc } from "firebase/firestore";
import { BaseModel } from "~/models/abstractModel";
import { Model, ModelConstructor } from "~/types/model";
import { CollectionKeys, Repository } from "~/types/repositories";


export abstract class AbstractRepository<T extends Model, U extends CollectionKeys> implements Repository<T, U>{
    constructor(
        protected firestore: Firestore,
        protected modelConstructor: ModelConstructor<T>,
        public readonly collectionName: string,
    ) { }

    newModelInstance(id: string = ''): T {
        return new this.modelConstructor(id);
    }

    /**
     * Get the path to the collection containing the document
     * 
     * @param collectionKeys - A list of document IDs to use for the path to the collection containing the document.
     */
    protected getCollectionPath(collectionKeys: U): string {
        let collectionPath = '';

        for (const key of Object.keys(collectionKeys)) {
            collectionPath += key + '/';
            collectionPath += collectionKeys[key] + '/';
        }

        collectionPath += this.collectionName;

        return collectionPath;
    }


    async getList(collectionKeys: U, queryConstraints?: QueryConstraint[]): Promise<T[]> {
        const collectionPath = this.getCollectionPath(collectionKeys);

        if (queryConstraints === undefined) {
            queryConstraints = [];
        }
        const q = query(
            collection(this.firestore, collectionPath).withConverter(BaseModel.converter<T>(this.modelConstructor)),
            ...queryConstraints);
        const querySnapshot = await getDocs(q);

        const model: T[] = [];
        querySnapshot.forEach((doc) => {
            model.push(doc.data());
        });

        return model;
    }

    async find(collectionKeys: U, id: string): Promise<T> {
        const collectionPath = this.getCollectionPath(collectionKeys);

        const docRef = doc(this.firestore, collectionPath, id).withConverter(BaseModel.converter<T>(this.modelConstructor));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("The document not found: id='" + id + "'");
        }

        return docSnap.data();
    }

    async add(collectionKeys: U, model: T): Promise<void> {
        const collectionPath = this.getCollectionPath(collectionKeys);

        const ref = collection(this.firestore, collectionPath).withConverter(BaseModel.converter<T>(this.modelConstructor));
        await addDoc(ref, model);
    }

    async update(collectionKeys: U, model: T): Promise<void> {
        const collectionPath = this.getCollectionPath(collectionKeys);

        const docRef = doc(this.firestore, collectionPath, model.id).withConverter(BaseModel.converter<T>(this.modelConstructor));
        await setDoc(docRef, model);
    }
}