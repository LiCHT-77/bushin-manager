import { Plugin } from '@nuxt/types';
import { BlockGroupRepository } from '~/repositories/blockGroupRepository';
import { ContestRepository } from '~/repositories/contestRepository';
import { DivisionRepository } from '~/repositories/divisionRepository';
import { PlayerRepository } from '~/repositories/playerRepository';

interface Repositories {
    contestRep: ContestRepository;
    playerRep: PlayerRepository;
    divisionRep: DivisionRepository;
    blockGroupRep: BlockGroupRepository;
}

declare module '@nuxt/types' {
    interface Context {
        $reps: Repositories;
    }
}

const repositoriesPlugin: Plugin = (context) => {
    // Init repositories
    const firestore = context.$firebase.firestore;
    const contestRep = new ContestRepository(firestore);
    const playerRep = new PlayerRepository(firestore);
    const divisionRep = new DivisionRepository(firestore);
    const blockGroupRep = new BlockGroupRepository(firestore);

    // Create Repositories object
    const reps: Repositories = {
        contestRep,
        playerRep,
        divisionRep,
        blockGroupRep,
    };
    context.$reps = reps;
};

export default repositoriesPlugin;