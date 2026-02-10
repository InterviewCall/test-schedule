import { Document, Model, model, models, Schema } from 'mongoose';

import { TEST_STATUS } from '@/enums/TestStatus';

export interface ISchedule extends Document {
    candidateName: string
    candidateEmail: string
    startTime: Date
    endTime: Date
    invitedBy: string
    testStatus: TEST_STATUS
    reportCard: string | null
    percentage: number | null
    ratings: number | null
    problemLevel: string
    mailId: string
}

const scheduleSchema = new Schema<ISchedule>({
    candidateName: {
        type: String,
        required: true
    },

    candidateEmail: { 
        type: String, 
        required: true,
        unique: true
    },

    mailId: {
        type: String,
        required: true,
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true,
        index: true
    },

    invitedBy: {
        type: String,
        required: true,
        index: true
    },

    testStatus: {
        type: String,
        enum: Object.values(TEST_STATUS),
        default: TEST_STATUS.INVITED,
        required: true,
        index: true
    },

    reportCard: {
        type: String,
        default: null
    },

    percentage: {
        type: Number,
        default: null
    },

    ratings: {
        type: Number,
        default: null
    },

    problemLevel: {
        type: String,
        required: true
    }
}, { timestamps: true });

scheduleSchema.index({ dateOfTest: 1, endTime: 1, testStatus: 1 });

const ScheduleModel: Model<ISchedule> = models.ScheduleModel || model<ISchedule>('ScheduleModel', scheduleSchema);

export default ScheduleModel;