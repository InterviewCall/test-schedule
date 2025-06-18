import { ISchedule } from '@/models/ScheduleModel';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';

import { CandidateQueryStrategy } from './CandidateQueryStrategy';

class AllCandidatesStrategy implements CandidateQueryStrategy {
    private repository;

    constructor(repository: TestScheduleRepository) {
        this.repository = repository;
    }

    async getCandidateDetails(): Promise<ISchedule[]> {
        return this.repository.getAllTest();
    }
}

export default AllCandidatesStrategy;