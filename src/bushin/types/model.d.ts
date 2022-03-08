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
    [key: string]: any;
}

export interface ModelConstructor<T extends Model> {
    new(id: string): T;
}


export interface Contest extends Model {
    name: string;
    date: Date;
    isPublish: boolean;
}

export interface Player extends Model {
    name: string;
    dojo: string;
    age: number;
    rank: Rank;
}

export interface Division extends Model {
    name: string;
    ranks: Array<Rank>;
    contestType: ContestType;
    order: number;
}

export interface BlockGroup extends Model {
    name: string;
    isFinished: boolean;
    order: number
}
