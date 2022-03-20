import { Plugin } from '@nuxt/types';
import { BlockGroupRepository } from '~/repositories/blockGroupRepository';
import { BlockRepository } from '~/repositories/blockRepository';
import { ContestRepository } from '~/repositories/contestRepository';
import { DivisionRepository } from '~/repositories/divisionRepository';
import { PlayerRepository } from '~/repositories/playerRepository';

interface Repositories {
    contestRep: ContestRepository;
    playerRep: PlayerRepository;
    divisionRep: DivisionRepository;
    blockGroupRep: BlockGroupRepository;
    blockRep: BlockRepository;
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
    const blockRep = new BlockRepository(firestore);

    // Create Repositories object
    const reps: Repositories = {
        contestRep,
        playerRep,
        divisionRep,
        blockGroupRep,
        blockRep,
    };
    context.$reps = reps;
};

export default repositoriesPlugin;