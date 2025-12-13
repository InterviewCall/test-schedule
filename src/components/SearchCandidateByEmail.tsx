import axios, { AxiosError, AxiosResponse } from 'axios';
import { Search } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorResponse } from 'resend';

import { Test, TestResponse } from '@/types';
interface Props {
    updateTests: (tests: Test[]) => void
    setLoading: (state: boolean) => void
}

export default function SearchCandidateByEmail({ updateTests, setLoading }: Props) {
    const [email, setEmail] = useState<string>('');
    const [search, setSearch] = useState(false);

    async function fetchTests(email: string) {
        try {
            setLoading(true);
            const response: AxiosResponse<TestResponse> = await axios.get(`/api/get-candidate-by-email?email=${email}`);
            console.log(response);
            updateTests(response.data.data);
            if(email.length == 0){
                toast.error('Please enter a email ');
            }
            // if(email.length){
            // }else{
            //     const response: AxiosResponse<TestResponse> = await axios.get('/api/get-all-tests');
            //     updateTests(response.data.data);
            // }
        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;
            const message = err.response?.data.message || 'Something went wrong!';
            toast.error(message);
        } finally {
            setLoading(false);
            setSearch(false);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };


    useEffect(() => {
        if (search) {
            if(isValidEmail(email)){
                fetchTests(email);
            }else{
                toast.error('Please enter a valid email address.');
                setLoading(false);
                setSearch(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <label className="input rounded-full input-bordered bg-white text-black border-gray-300 pr-0 pl-4 w-[30%] h-12 flex items-center">
             <Search size={18} className="flex items-center" />
            <input
                type="search"
                placeholder="Search by email"
                value={email}
                onChange={handleChange}
                className="bg-transparent text-black placeholder-gray-500 placeholder-opacity-100"
            />
            <button className=" flex rounded-full items-center gap-x-2 h-full px-4 bg-green-300 text-black ml-2 hover:bg-green-400 transition-colors hover:cursor-pointer" onClick={() => { setSearch(true); }}>
                <Search size={18} />
            </button>
        </label>
    );
}
