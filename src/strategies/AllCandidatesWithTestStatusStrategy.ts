import { TEST_STATUS } from '@/enums/TestStatus';
import { ISchedule } from '@/models/ScheduleModel';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';

import { CandidateQueryStrategy } from './CandidateQueryStrategy';

class AllCandidatesWithTestStatusStrategy implements CandidateQueryStrategy {
    private repository;
    private status;

    constructor(repository: TestScheduleRepository, status: TEST_STATUS) {
        this.repository = repository;
        this.status = status;
    }

    async getCandidateDetails(): Promise<ISchedule[]> {
        return await this.repository.getTestsByTestStatus(this.status);
    }
}

export default AllCandidatesWithTestStatusStrategy;