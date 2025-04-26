import AuthRepository from '@/repositories/AuthRepository';
import AuthService from '@/services/AuthService';

const authService = new AuthService(new AuthRepository());

export default authService;