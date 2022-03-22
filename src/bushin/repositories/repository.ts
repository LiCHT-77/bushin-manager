import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, query, QueryConstraint, setDoc } from "firebase/firestore";
import { Model } from "~/models/model";
import { ModelConstructor } from "~/types/model";

export abstract class Repository<T extends Model, U extends string>{
    constructor(
        protected firestore: Firestore,
        protected modelConstructor: ModelConstructor<T>,
        public readonly collectionName: string,
    ) { }

    /**
     * Get new Model instance
     * 
     * @param id - `Id` of `Model`
     */
    newModelInstance(id: string = ''): T {
        return new this.modelConstructor(id);
    }

    /**
     * Get a list of entities that match the constraints
     * 
     * @param collectionPath - collection path for documents
     * @param queryConstraints - Query constraints
     */
    async getList(collectionPath: U, queryConstraints?: QueryConstraint[]): Promise<T[]> {
        if (queryConstraints === undefined) {
            queryConstraints = [];
        }
        const q = query(
            collection(this.firestore, collectionPath).withConverter(Model.converter<T>(this.modelConstructor)),
            ...queryConstraints);
        const querySnapshot = await getDocs(q);

        const model: T[] = [];
        querySnapshot.forEach((doc) => {
            model.push(doc.data());
        });

        return model;
    }

    /**
     * Retrieve entities that match the `id`
     * 
     * @param collectionPath - collection path for documents
     * @param id - Document id
     */
    async find(collectionPath: U, id: string): Promise<T> {
        const docRef = doc(this.firestore, collectionPath, id).withConverter(Model.converter<T>(this.modelConstructor));
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("The document not found: id='" + id + "'");
        }

        return docSnap.data();
    }

    /**
     * Add a model to the backend
     * 
     * @param collectionPath - collection path for documents
     * @param model - A model
     */
    async add(collectionPath: U, model: T): Promise<void> {
        const ref = collection(this.firestore, collectionPath).withConverter(Model.converter<T>(this.modelConstructor));
        await addDoc(ref, model);
    }

    /**
     * Set a model to the backend. The model must be an Document already exist in the backend.
     * 
     * @param collectionPath - collection path for documents
     * @param model - A model
     */
    async update(collectionPath: U, model: T): Promise<void> {
        const docRef = doc(this.firestore, collectionPath, model.id).withConverter(Model.converter<T>(this.modelConstructor));
        await setDoc(docRef, model);
    }

    /**
     * Delete a document without delete sub collection
     * 
     * @param collectionPath - collection path for document
     * @param id - Document id
     */
    async delete(collectionPath: U, id: string): Promise<void> {
        const docRef = doc(this.firestore, collectionPath, id);
        await deleteDoc(docRef);
    }
}