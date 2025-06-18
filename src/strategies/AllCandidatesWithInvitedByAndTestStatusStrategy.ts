import { TEST_STATUS } from '@/enums/TestStatus';
import { ISchedule } from '@/models/ScheduleModel';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';

import { CandidateQueryStrategy } from './CandidateQueryStrategy';

class AllCandidatesWithInvitedByAndTestStatusStrategy implements CandidateQueryStrategy {
    private repository;
    private invitedBy;
    private status;

    constructor(respository: TestScheduleRepository, invitedBy: string, status: TEST_STATUS) {
        this.repository = respository;
        this.invitedBy = invitedBy;
        this.status = status;
    }

    async getCandidateDetails(): Promise<ISchedule[]> {
        return await this.repository.getAllCandidatesByInvitedByWithTestStatus(this.invitedBy, this.status);
    }
}

export default AllCandidatesWithInvitedByAndTestStatusStrategy;