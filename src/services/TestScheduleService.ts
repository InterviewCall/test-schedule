import { TEST_STATUS } from '@/enums/TestStatus';
import TestScheduleRepository from '@/repositories/TestScheduleRepository';
import { TestRequest } from '@/types';
import { formatDate, formatTime, getMaxStartTime } from '@/utils';

import { sendEmail } from './emailService';

class TestScheduleService {
    private testScheduleRepository;

    constructor(testScheduleRepository: TestScheduleRepository) {
        this.testScheduleRepository = testScheduleRepository;
    }

    async createTest(data: TestRequest) {
        try {
            const test = await this.testScheduleRepository.createTest(data);
            const date = formatDate(data.dateOfTest);
            const timeSlot = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;
            const maxStartTime = getMaxStartTime(data.endTime);

            await sendEmail(date, timeSlot, formatTime(maxStartTime), data.candidateEmail);
            return test;
        } catch (error) {
            console.log(error);
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

    async getTest(email: string) {
        try {
            const test = await this.testScheduleRepository.getTest(email);
            return test;
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

    async updateDateTimeSlot(email: string, startTime: Date, endTime: Date, date?: Date) {
        try {
            const candidate = await this.testScheduleRepository.updateDateTimeSlot(email, startTime, endTime, date);
            const testDate = date ? formatDate(date) : formatDate(candidate.dateOfTest);
            const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;
            const maxStartTime = getMaxStartTime(endTime);

            await sendEmail(testDate, timeSlot, formatTime(maxStartTime), email);
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
}

export default TestScheduleService;