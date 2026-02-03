'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { Check, ChevronDown } from 'lucide-react';
// import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { advisorOptions } from '@/constants';
import { UserContext } from '@/contexts/UserContext';
import { ErrorResponse, Test, TestResponse } from '@/types';

// const statusOptions = ['Submitted', 'Expired', 'Invited'];

interface Props {
  updateTests: (tests: Test[]) => void;
  setLoading: (state: boolean) => void;
}

const InvitationFilter: FC<Props> = ({ updateTests, setLoading }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<string[] | undefined>();
  const searchParams = useSearchParams();
  const [testBda, setTestBda] = useState<string | null>(null);
  const { userDetails } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    fetchBDAs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!userDetails) {
      router.replace('/login');
      return;
    }
    const email = searchParams.get('email');
    if (email) return;
    const bda = searchParams.get('bda');
    setTestBda(bda);
    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, userDetails]);

  async function fetchBDAs() {
    try {
      setLoading(true);
      const dba = advisorOptions;
      setOptions(dba.map((option) => option.label));
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message = err.response?.data.message || 'Something went wrong!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function updateQueryParams({ key, value }: { key: string; value: string }) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`);
  }

  function removeQueryParams({ key }: { key: string }) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`?${params.toString()}`);
  }

  async function fetchTests() {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(searchParams.toString());
      const bda = urlParams.get('bda');
      const status = urlParams.get('status');
      const params: Record<string, string | null> = {};

      if (userDetails.userType == 'user') {
        params['invited-by'] = userDetails.userName;
      }

      if (bda) {
        params['invited-by'] = bda;
      }

      if (status) {
        params['status'] = status;
      }

      const response: AxiosResponse<TestResponse> = await axios.get(
        '/api/get-all-tests',
        {
          params,
        }
      );
      updateTests(response.data.data);
      setLoading(false);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message = err.response?.data.message || 'Something went wrong!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-end p-6">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex btn btn-secondary cursor-pointer justify-between items-center w-40 px-4 py-2 text-sm font-medium text-white rounded-lg shadow focus:outline-none"
      >
        {testBda ? testBda : 'Filter BDA'}
        <ChevronDown className="ml-2 w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-10 mt-10 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <div
                className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-pink-400 hover:text-white"
                // href='/tests'
                onClick={() => {
                  removeQueryParams({ key: 'bda' });
                  setOpen(false);
                }}
              >
                All DBAs
              </div>
            </li>
            {options?.map((bda) => (
              <li key={bda}>
                <div
                  className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-pink-400 hover:text-white"
                  onClick={() => {
                      updateQueryParams({ key: 'bda', value: bda });
                      setOpen(false);
                    }}
                >
                  <span>
                    {bda}
                  </span>
                  {testBda === bda && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default InvitationFilter;
