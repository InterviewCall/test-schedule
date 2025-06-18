import AuthRepository from '@/repositories/AuthRepository';

class AuthService {
    private authRepository;

    constructor(authRepository: AuthRepository) {
        this.authRepository = authRepository;
    }

    async createUser(userEmail: string, userName: string, password: string, adminEmail: string) {
        try {
            const user = await this.authRepository.createUser(userEmail, userName, password, adminEmail);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async authenticateUser(userEmail: string, password: string) {
        try {
            const user = await this.authRepository.authenticateUser(userEmail, password);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUser(userEmail: string) {
        try {
            const user = await this.authRepository.getUser(userEmail);
            return user;
        } catch (error) {
            throw error;
        }
    }

}

export default AuthService;