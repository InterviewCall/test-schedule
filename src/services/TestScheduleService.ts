import { TEST_STATUS } from '@/enums/TestStatus';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';
import candidateQueryFactoryStrategy from '@/strategies/candidateQueryStrategyFactory';
import { TestRequest } from '@/types';
import { formatDate, formatTime, getMaxStartTime } from '@/utils';

import { retrieveEmail, sendEmail } from './emailService';

class TestScheduleService {
    private testScheduleRepository;

    constructor(testScheduleRepository: TestScheduleRepository) {
        this.testScheduleRepository = testScheduleRepository;
    }

    async getTaskCount(invitedBy: string | null) {
        try{
            if( !invitedBy ) throw new Error('InvitedBy parameter is required to get task count');

            const records = await this.testScheduleRepository.getTaskCount(invitedBy);
            const totalTasks = records.reduce((acc, curr) => acc + curr.count, 0);
            const taskCounts = records.reduce((acc, record) => {
                acc[record._id] = {
                    count: record.count,
                    percentage: Number(((record.count / totalTasks) * 100).toFixed(2)),
                };
                return acc;
                }, {} as Record<string, { count: number; percentage: number }>);
            const response = { totalTasks, taskCounts };
            return response;
        } catch (error) {
            throw error;
        }
    }

    async createTest(data: TestRequest) {
        try {
            const date = formatDate(data.startTime);
            const timeSlot = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;
            const maxStartTime = getMaxStartTime(data.endTime);
            
            const response = await sendEmail(date, timeSlot, formatTime(maxStartTime), data.candidateEmail);

            const test = await this.testScheduleRepository.createTest(data, response.data!);
            return test;
        } catch (error) {
            throw error;
        }
    }

    async retrieveEmail(email: string) {
        try {
            const candidate = await this.testScheduleRepository.getTest(email, true);
            if(candidate?.mailId) {
                const response = await retrieveEmail(candidate.mailId);
                return response.data?.last_event;
            }

            return '';
        } catch (error) {
            throw error;
        }
    }

    async getAllTests() {
        try {
            const tests = await this.testScheduleRepository.getAllTest();
            return tests;
        } catch (error) {
            throw error;
        }
    }

    async getAllTestsCandidate() {
        try {
            const tests = await this.testScheduleRepository.getAllTestCandidate();
            return tests;
        } catch (error) {
            throw error;
        }
    }

    async getAllCandidates(invitedBy: string | null, testStatus: TEST_STATUS | null) {
        try {
            const getAllCandidatesStrategy = candidateQueryFactoryStrategy(this.testScheduleRepository, invitedBy, testStatus);
            return await getAllCandidatesStrategy.getCandidateDetails();
        } catch (error) {
            throw error;
        }
    }

    async getTest(email: string) {
        try {
            const test = await this.testScheduleRepository.getTest(email);
            return test;
        } catch (error) {
            throw error;
        }
    }

    async getAllTestsByTestStattus(testStatus: TEST_STATUS) {
        try {
            const tests = await this.testScheduleRepository.getTestsByTestStatus(testStatus);
            return tests;
        } catch (error) {
            throw error;
        }
    }

    async updateTestStatus(email: string, status: TEST_STATUS) {
        try {
            await this.testScheduleRepository.updateTestStatus(email, status);
        } catch (error) {
            throw error;
        }
    }

    async updatePercentage(email: string, percentage: number) {
        try {
            await this.testScheduleRepository.updatePercentage(email, percentage);
        } catch (error) {
            throw error;
        }
    }

    async updateReportCard(email: string, reportCard: string) {
        try {
            await this.testScheduleRepository.updateReportCard(email, reportCard);
        } catch (error) {
            throw error;
        }
    }

    async updateDateTimeSlot(email: string, startTime: Date, endTime: Date, updateAdvisor?: string) {
        try {
            const testDate = formatDate(startTime);
            const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            const maxStartTime = getMaxStartTime(endTime);
            
            const emailResponse = await sendEmail(testDate, timeSlot, formatTime(maxStartTime), email);
            
            await this.testScheduleRepository.updateDateTimeSlot(email, startTime, endTime, emailResponse.data!, updateAdvisor);
        } catch (error) {
            throw error;
        }
    }

    async updateDetails(email: string, reportCard: string, percentage: number) {
        try {
            const candidate = await this.testScheduleRepository.updateDetails(email, reportCard, percentage);
            return candidate;
        } catch (error) {
            throw error;
        }
    }

    async updateRating(email: string, ratings: number) {
        try {
            const candidate = await this.testScheduleRepository.updateRating(email, ratings);
            return candidate;
        } catch (error) {
            throw error;
        }
    }

    async deleteTest(email: string) {
        try {
            await this.testScheduleRepository.deleteTest(email);
        } catch (error) {
            throw error;
        }
    }

    async deleteManyTest(candidateEmails: string[], testStatus: TEST_STATUS | null) {
        try {
            await this.testScheduleRepository.deleteManyTest(candidateEmails);

            if(testStatus) {
                const currentTests = await this.testScheduleRepository.getTestsByTestStatus(testStatus);
                return currentTests;
            }

            const currentTests = await this.testScheduleRepository.getAllTest();
            return currentTests;
        } catch (error) {
            throw error;
        }
    }

    async getCandidateByEmail(email: string) {
        try{
            const candidateList = await this.testScheduleRepository.getCandidatesByEmail(email);
            return candidateList;
        }catch (error) {
            throw error;
        }
    }
}

export default TestScheduleService;