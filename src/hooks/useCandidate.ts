import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

import { TestResponse } from '@/types';

function useCandidates() {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['candidates'],
        queryFn: fetchTests,
        staleTime: 1000 * 60 * 60 * 24,
        refetchOnWindowFocus: false,
    });

    async function fetchTests() {
        const response: AxiosResponse<TestResponse> = await axios.get('/api/get-tests');
        return response.data;
    }

    const tests = data?.data ?? [];

    return { tests, isLoading, isError, error };
}

export default useCandidates;