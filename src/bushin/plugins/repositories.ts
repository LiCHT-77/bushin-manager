import { Plugin } from '@nuxt/types';
import { BlockGroupRepositoryImp } from '~/repositories/blockGroupRepository';
import { ContestRepositoryImp } from '~/repositories/contestRepository';
import { DivisionRepositoryImp } from '~/repositories/divisionRepository';
import { PlayerRepositoryImp } from '~/repositories/playerRepository';
import { BlockGroupRepository, ContestRepository, DivisionRepository, PlayerRepository } from '~/types/repositories';

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
    const contestRep = new ContestRepositoryImp(firestore);
    const playerRep = new PlayerRepositoryImp(firestore);
    const divisionRep = new DivisionRepositoryImp(firestore);
    const blockGroupRep = new BlockGroupRepositoryImp(firestore);

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