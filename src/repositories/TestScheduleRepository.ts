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

    async createTest(data: TestRequest): Promise<ISchedule> {
        const test = await this.scheduleModel.create(data);
        return test;
    }

    async getAllTest(): Promise<ISchedule[]> {
        const test = await this.scheduleModel.find().lean();
        return test;
    }

    async getTest(email: string) {
        const test = await this.scheduleModel.findOne({ candidateEmail: email }).lean();
        if(!test) {
            throw { message: 'No Credenials Found' };
        }

        return test;
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

    async updateDateTimeSlot(email: string, startTime: Date, endTime: Date, date?: Date) {
        const updateFields: Partial<ISchedule> = {
            startTime,
            endTime,
            testStatus: TEST_STATUS.INVITED
        };

        if(date) {
            updateFields.dateOfTest = date;
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