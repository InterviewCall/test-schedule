import TestScheduleRepository from '@/repositories/TestScheduleRepository';
import TestScheduleService from '@/services/TestScheduleService';

export const testScheduleService = new TestScheduleService(new TestScheduleRepository());