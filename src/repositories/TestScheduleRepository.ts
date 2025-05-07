import scheduleDb from '@/configs/db';
import { TEST_STATUS } from '@/enums/TestStatus';
import ScheduleModel, { ISchedule } from '@/models/ScheduleModel';
import { TestRequest } from '@/types';

class TestScheduleRepository {
    private scheduleModel;

    constructor() {
        scheduleDb.connect();
        this.scheduleModel = ScheduleModel;
    }

    async createTest(data: TestRequest, mailId: string): Promise<ISchedule> {
        const test = await this.scheduleModel.create({
            candidateName: data.candidateName,
            candidateEmail: data.candidateEmail,
            startTime: data.startTime,
            endTime: data.endTime,
            invitedBy: data.invitedBy,
            mailId: mailId
        });
        return test;
    }

    async getAllTest(): Promise<ISchedule[]> {
        const test = await this.scheduleModel.find().sort({ startTime: -1 }).lean();
        return test;
    }

    async getAllTestCandidate(): Promise<ISchedule[]> {
        const test = await this.scheduleModel.find({}, {
            candidateEmail: 1,
            candidateName: 1,
            invitedBy: 1,
            startTime: 1,
            endTime: 1,
            testStatus: 1,
            ratings: 1
        }).lean();
        return test;
    }

    async getTest(email: string, flag?: boolean) {
        if(flag) {
            const test = await this.scheduleModel.findOne({ candidateEmail: email }).lean();

            if(!test) {
                throw { message: 'No Credenials Found' };
            }

            return test;
        }

        const test = await this.scheduleModel.findOne({ candidateEmail: email }, {
            candidateEmail: 1,
            candidateName: 1,
            invitedBy: 1,
            startTime: 1,
            endTime: 1,
            testStatus: 1,
            ratings: 1
        }).lean();
        if(!test) {
            throw { message: 'No Credenials Found' };
        }

        return test;
    }

    async getTestsByTestStatus(testStatus: TEST_STATUS) {
        const tests = await this.scheduleModel.find({ testStatus }).sort({ startTime: -1 }).lean();
        return tests;
    }

    async updateTestStatus(email: string, status: TEST_STATUS) {
        const candidate = await this.scheduleModel.findOne({ candidateEmail: email });
        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        await this.scheduleModel.updateOne({ candidateEmail: email }, { $set: { testStatus: status } });
    }

    async updatePercentage(email: string, percentage: number) {
        const candidate = await this.scheduleModel.findOne({ candidateEmail: email });
        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        await this.scheduleModel.updateOne({ candidateEmail: email }, { $set: { percentage } });
    }

    async updateReportCard(email: string, reportCard: string) {
        const candidate = await this.scheduleModel.findOne({ candidateEmail: email });
        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        await this.scheduleModel.updateOne({ candidateEmail: email }, { $set: { reportCard }});
    }

    async updateDateTimeSlot(email: string, startTime: Date, endTime: Date, mailId: string, invitedBy?: string) {
        const updateFields: Partial<ISchedule> = {
            startTime,
            endTime,
            mailId,
            testStatus: TEST_STATUS.INVITED
        };

        if(invitedBy) {
            updateFields.invitedBy = invitedBy;
        }

        const candidate = await this.scheduleModel.findOneAndUpdate({ candidateEmail: email }, { $set: updateFields }, { new: true }).lean();
        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        return candidate;
    }

    async updateDetails(email: string, reportCard: string, percentage: number) {
        const candidate = await this.scheduleModel.findOneAndUpdate({ candidateEmail: email }, {
            reportCard,
            percentage,
            testStatus: TEST_STATUS.SUBMITTED
        }, { new: true }).lean();

        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        return candidate;
    }

    async updateRating(email: string, ratings: number) {
        const candidate = await this.scheduleModel.findOneAndUpdate({ candidateEmail: email }, { ratings }, { new: true }).lean();

        if(!candidate) {
            throw { message: 'No Credenials Found' };
        }

        return candidate;
    }

    async deleteTest(email: string) {
        const test = await this.scheduleModel.findOne({ candidateEmail: email });
        if(!test) {
            throw { message: 'No Credenials found' };
        }
        await this.scheduleModel.deleteOne({ candidateEmail: email });
    }
}

export default TestScheduleRepository;