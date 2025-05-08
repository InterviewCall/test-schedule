import { TEST_STATUS } from '@/enums/TestStatus';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';
import { TestRequest } from '@/types';
import { formatDate, formatTime, getMaxStartTime } from '@/utils';

import { retrieveEmail, sendEmail } from './emailService';

class TestScheduleService {
    private testScheduleRepository;

    constructor(testScheduleRepository: TestScheduleRepository) {
        this.testScheduleRepository = testScheduleRepository;
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
}

export default TestScheduleService;