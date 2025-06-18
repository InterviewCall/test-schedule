import { ISchedule } from '@/models/ScheduleModel';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';

import { CandidateQueryStrategy } from './CandidateQueryStrategy';

class AllCandidatesWithInvitedByStrategy implements CandidateQueryStrategy {
    private repository;
    private invitedBy;

    constructor(repository: TestScheduleRepository, invitedBy: string) {
        this.repository = repository;
        this.invitedBy = invitedBy;
    }

    async getCandidateDetails(): Promise<ISchedule[]> {
        return await this.repository.getAllCandidatesByInvitedBy(this.invitedBy);
    }
}

export default AllCandidatesWithInvitedByStrategy;