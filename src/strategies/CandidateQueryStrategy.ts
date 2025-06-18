import { ISchedule } from '@/models/ScheduleModel';

export interface CandidateQueryStrategy {
    getCandidateDetails: () => Promise<ISchedule[]>
}