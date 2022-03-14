import { DocumentReference } from "firebase/firestore";

/**
 * Match format
 */
export type ContestType = '通常' | '3形合計';

/**
 * Kyu/Dan
 */
type Ranks = ['8級', '7級', '6級', '5級', '4級', '3級', '2級', '1級', '初段', '2段', '3段', '4段'];
export type Rank = Ranks[number];


export interface Model {
    readonly id: string;
    readonly ref: DocumentReference | null;
    [key: string]: any;
}

export interface ModelConstructor<T extends Model> {
    new(id: string, ref?: DocumentReference, ...args: any[]): T;
}
