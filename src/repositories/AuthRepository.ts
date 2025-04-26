import scheduleDb from '@/configs/db';
import Auth from '@/models/Auth';

class AuthRepository {
    private authModel;

    constructor() {
        scheduleDb.connect();
        this.authModel = Auth;
    }

    async createUser(userEmail: string, password: string, adminEmail: string) {
        const admin = await this.authModel.findOne({ userEmail: adminEmail }).lean();
        if(!admin) {
            throw { message: 'No Credenials Found' };
        } else if(admin.userType != 'admin') {
            throw { message: 'Only admin can add users' };
        }

        const user = await this.authModel.create({ userEmail, userPassword: password });
        return user;
    }

    async authenticateUser(userEmail: string, password: string) {
        const user = await this.authModel.findOne({ userEmail }).lean();

        if(!user) {
            throw { message: 'No Credentials Found' };
        } else if(user.userPassword != password) {
            throw { message: 'Wrong password' };
        }

        return await this.authModel.findOne({ userEmail }, { userEmail: 1, userType: 1, _id: 1 }).lean();
    }

    async getUser(userEmail: string) {
        const user = await this.authModel.findOne({ userEmail }, { userEmail: 1, userType: 1, _id: 1 }).lean();
        return user;
    }
}

export default AuthRepository;