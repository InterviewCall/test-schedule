import { TEST_STATUS } from '@/enums/TestStatus';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';

import AllCandidatesStrategy from './AllCandidatesStrategy';
import AllCandidatesWithInvitedByAndTestStatusStrategy from './AllCandidatesWithInvitedByAndTestStatusStrategy';
import AllCandidatesWithInvitedByStrategy from './AllCandidatesWithInvitedByStrategy';
import AllCandidatesWithTestStatusStrategy from './AllCandidatesWithTestStatusStrategy';
import { CandidateQueryStrategy } from './CandidateQueryStrategy';

function candidateQueryFactoryStrategy(repository: TestScheduleRepository, invitedBy: string | null, status: TEST_STATUS | null): CandidateQueryStrategy {
    if(!invitedBy && !status) {
        return new AllCandidatesStrategy(repository);
    }

    if(!invitedBy && status) {
        return new AllCandidatesWithTestStatusStrategy(repository, status);
    }

    if(invitedBy && !status) {
        return new AllCandidatesWithInvitedByStrategy(repository, invitedBy);
    }

    return new AllCandidatesWithInvitedByAndTestStatusStrategy(repository, invitedBy!, status!);
}

export default candidateQueryFactoryStrategy;