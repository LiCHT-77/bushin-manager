import { QueryConstraint } from "firebase/firestore";
import { BlockGroup, Contest, Division, Model, Player } from "./model";
import { ContestCollectionKeys } from "~/models/contest";
import { DivisionCollectionKeys } from "~/models/division";
import { BlockGroupCollectionKeys } from "~/models/blockGroup";
import { PlayerCollectionKeys } from "~/models/player";

export interface CollectionKeys {
    [key: string]: string;
}

/**
 * All repositories interface
 */
export interface Repository<T extends Model, U extends CollectionKeys> {
    readonly collectionName: string;

    /**
     * Get new Model instance
     * 
     * @param id - `Id` of `Model`
     */
    newModelInstance(id?: string): T;

    /**
     * Get a list of entities that match the constraints
     * 
     * @param collectionKeys - A list of document IDs to use for the path to the collection containing the document.
     * @param queryConstraints - Query constraints
     */
    getList(collectionKeys: U, queryConstraints?: QueryConstraint[]): Promise<T[]>;

    /**
     * Retrieve entities that match the `id`
     * 
     * @param collectionKeys - A list of document IDs to use for the path to the collection containing the document.
     * @param id - Document id
     */
    find(collectionKeys: U, id: string): Promise<T>;

    /**
     * Add a model to the backend
     * 
     * @param collectionKeys - A list of document IDs to use for the path to the collection containing the document.
     * @param model - A model
     */
    add(collectionKeys: U, model: T): Promise<void>;

    /**
     * Set a model to the backend. The model must be an Document already exist in the backend.
     * 
     * @param collectionKeys - A list of document IDs to use for the path to the collection containing the document.
     * @param model - A model
     */
    update(collectionKeys: U, model: T): Promise<void>;
}


export interface ContestRepository extends Repository<Contest, ContestCollectionKeys> {
    // 
}

export interface PlayerRepository extends Repository<Player, PlayerCollectionKeys> {
    // 
}

export interface DivisionRepository extends Repository<Division, DivisionCollectionKeys> {
    updateOrders(collectionKeys: DivisionCollectionKeys, divisions: Division[]): Promise<void>;
}

export interface BlockGroupRepository extends Repository<BlockGroup, BlockGroupCollectionKeys> {
    updateOrders(collectionKeys: BlockGroupCollectionKeys, blockGroups: BlockGroup[]): Promise<void>;
}
