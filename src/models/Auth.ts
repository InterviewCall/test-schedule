import { Document, Model, model, models, Schema } from 'mongoose';

export interface IAuth extends Document {
    userEmail: string
    userName: string
    userPassword: string
    userType: string
}

const authSchema = new Schema<IAuth>({
    userEmail: {
        type: String,
        required: true,
        index: true
    },

    userName: {
        type: String,
        required: true,
        index: true
    },

    userPassword: {
        type: String,
        required: true
    },

    userType: {
        type: String,
        default: 'user',
        index: true
    }
});

const Auth: Model<IAuth> = models.Auth || model<IAuth>('Auth', authSchema);

export default Auth;