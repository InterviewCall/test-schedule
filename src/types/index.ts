import { TEST_STATUS } from '@/enums/TestStatus';

export interface Details {
    candidateName: string
    candidateEmail: string
}

export interface ErrorResponse {
    success: false
    message: string
    data: unknown
    error: unknown 
}
  
export interface OptionType {
    value: string
    label: string
}

export interface TestProps {
    date: string
    timeSlot: string
    testLink: string
    maxStartTime: string
}

export interface TestRequest {
    candidateName: string
    candidateEmail: string
    startTime: Date
    endTime: Date
    invitedBy: string
    problemLevel: string
}

export interface Test {
    candidateName: string
    candidateEmail: string
    dateOfTest: Date
    startTime: Date
    endTime: Date
    invitedBy: string
    testStatus: TEST_STATUS
    reportCard: string | null
    percentage: number | null
    problemLevel: string
    ratings: number | null
}

export interface TestResponse {
    data: Test[]
}

export interface User {
    _id: string
    userEmail: string
    userName: string
    userType: string
}

export interface UserResponse {
    data: User
}

export interface EmailStatus {
    data: string
}