import axios, { AxiosError, AxiosResponse } from 'axios';
import { Check, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { ErrorResponse, Test, TestResponse } from '@/types';

const statusOptions = ['Submitted', 'Expired', 'Invited'];

interface Props {
    updateTests: (tests: Test[]) => void
    setLoading: (state: boolean) => void
}

const StatusFilter: FC<Props> = ({ updateTests, setLoading }) => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const [testStatus, setTestStatus] = useState<string | null>(null);

  useEffect(() => {
    const status = searchParams.get('status');
    setTestStatus(status);
    fetchTests(status);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function fetchTests(testStatus: string | null) {
    try {
        setLoading(true);
        const response: AxiosResponse<TestResponse> = await axios.get('/api/get-all-tests-by-status', {
            params: {
                status: testStatus
            }
        });
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
        {testStatus ? testStatus : 'Filter Status'}
        <ChevronDown className="ml-2 w-4 h-4" />
      </button>

      {open && (
        <div className="absolute z-10 mt-10 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <ul className="py-1 text-sm text-gray-700">
            <li>
              <Link
                className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-pink-400 hover:text-white"
                href='/tests'
                onClick={() => setOpen(false)}
              >
                All Statuses
              </Link>
            </li>
            {statusOptions.map((status) => (
              <li key={status}>
                <Link
                  className="w-full text-left flex items-center justify-between px-4 py-2 hover:bg-pink-400 hover:text-white"
                  href={`?status=${status}`}
                  onClick={() => setOpen(false)}
                >
                  <span>{status}</span>
                  {testStatus === status && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
