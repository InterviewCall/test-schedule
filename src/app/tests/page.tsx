'use client';

import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import Loader from '@/components/Loader';
import Ratings from '@/components/Ratings';
import StatusFilter from '@/components/StatusFilter';
import { UserContext } from '@/contexts/UserContext';
import { EmailStatus, ErrorResponse, Test, TestResponse } from '@/types';
import { adminDashBoard, formatDate, formatTime, userDashBoard } from '@/utils';

const AllCandidates: FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmail, setShowEmail] = useState('');
  const [status, setStatus] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [header, setHeader] = useState<string[]>([]);
  const { userDetails } = useContext(UserContext);
  const emailRef = useRef<HTMLDialogElement>(null!);
  const router = useRouter();
  const searchParams = useSearchParams();

  
  useEffect(() => {
    if (!userDetails) {
      router.replace('/login');
      return;
    }
    setHeader(userDetails.userType === 'admin' ? adminDashBoard : userDashBoard);
  }, [userDetails, router]);

  function updateTests(tests: Test[]) {
    setTests(tests);
  }

  function setLoading(state: boolean) {
    setIsLoading(state);
  }

  async function retrieveEmailStatus(email: string) {
    try {
      const response: Promise<AxiosResponse<EmailStatus>> = axios.get('/api/retrieve-email', {
        params: {
          email
        }
      });

      toast.promise(response, {
        loading: 'Checking...',
        success: 'Successfully Fetched',
        error: 'Something went wrong'
      });

      const res = (await response).data.data;

      if(res == '') {
        setStatus('status not found');
        return;
      }

      setStatus(res); 

    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message = err.response?.data.message || 'Something went wrong';
      toast.error(message);
    }
  }

  function handleCheck(email: string, checked: boolean) {
    if(checked) {
      setEmails((prev) => [...prev, email]);
    } else {
      setEmails((prev) => prev.filter((existingEmail) => existingEmail != email));
    }
  }

  async function deleteCandidate() {
    if(emails.length == 0) {
      toast.error('No candidates selected');
      return;
    }

    try {
      const status = searchParams.get('status');
      const response: Promise<AxiosResponse<TestResponse>> = axios.delete('/api/delete-many-tests', {
        data: { emails },
        params: { status }
      });

      toast.promise(response, {
        loading: 'Deleting...',
        success: 'Successfully Deleted',
        error: 'Something went wrong!'
      });

      const res = (await response).data.data;
      setTests(res);
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      const message = err.response?.data.message || 'Something Went wrong!';
      toast.error(message);
    }
  }

  if (!userDetails)
    return (
      <div className="bg-white h-[100dvh]">
        <Loader />
      </div>
    );

  return (
    <div className='w-full h-[100dvh] overflow-hidden bg-gray-50 text-black px-4'>
      {isLoading && <Loader />}
      <dialog ref={emailRef} className='modal'>
        <div className='modal-box rounded-xl shadow-lg bg-white'>
          <h3 className='font-bold text-lg'>Email Address</h3>
          <p className='py-4 text-gray-700'>{showEmail}</p>
          {status && <p>Status: <span className={clsx(status == 'delivered' ? 'text-green-500' : status == 'bounced' ? 'text-red-500' : 'text-primary')}>{status}</span></p>}
          <div className='modal-action'>
            <button
              className='btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded'
              onClick={(e) => {
                e.preventDefault();
                emailRef.current.close();
                setStatus('');
              }}
            >
              Close
            </button>

            <button className='btn btn-accent text-white'
              onClick={() => retrieveEmailStatus(showEmail)}
            >
              Check Mail Status
            </button>
          </div>
        </div>
      </dialog>

      <div className='flex justify-between'>
        {userDetails && userDetails.userType == 'admin' && <button className='btn btn-error text-white m-6' onClick={deleteCandidate}>Delete Candidate</button>}

        <StatusFilter updateTests={updateTests} setLoading={setLoading} />
      </div>

      {/* Desktop View */}
      <div className={clsx(userDetails && userDetails.userType == 'admin' ? 'lg:grid grid-cols-10' : 'lg:grid grid-cols-8', 'hidden sticky bg-indigo-600 text-white shadow-md rounded-t-md font-semibold text-center')}>
        {header.length > 0 && header.map((header, idx) => (
          <div key={idx} className='py-3 px-2 border-b'>
            {header}
          </div>
        ))}
      </div>

      <div className='divide-y lg:max-h-[75dvh] max-h-[85dvh] overflow-y-auto divide-gray-200 shadow overflow-hidden rounded-b-md'>
        {tests.length > 0 ? (
          tests.map((candidate, index) => (
            <div
              key={index}
              className={clsx(userDetails.userType == 'admin' ? 'lg:grid-cols-10' : 'lg:grid-cols-8',
                'grid grid-cols-1 text-sm bg-white transition py-3 hover:bg-indigo-200',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              )}
            >
              {/* Desktop Cells */}
              {userDetails.userType == 'admin' && <div className='flex lg:justify-center justify-end max-md:pr-5'>
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-secondary" 
                  checked={emails.includes(candidate.candidateEmail)}
                  onChange={(e) => handleCheck(candidate.candidateEmail, e.target.checked)}
                />
              </div>}
              <div className='hidden lg:block text-center'>
                {/* <input type="checkbox" defaultChecked className="checkbox checkbox-secondary" /> */}
                {candidate.candidateName}
              </div>
              <div
                className='hidden lg:block text-blue-600 hover:underline text-center cursor-pointer'
                onClick={() => {
                  setShowEmail(candidate.candidateEmail);
                  emailRef.current.showModal();
                }}
              >
                Show Email
              </div>
              <div className='hidden lg:block text-center'>{formatDate(candidate.startTime)}</div>
              <div className='hidden lg:block text-center'>
                {formatTime(candidate.startTime)} - {formatTime(candidate.endTime)}
              </div>
              <div className='hidden lg:block text-center'>{candidate.testStatus}</div>
              <div
                className={clsx(
                  'hidden lg:block text-center',
                  candidate.reportCard
                    ? 'text-blue-600 hover:underline cursor-pointer'
                    : 'text-gray-400'
                )}
                onClick={() => candidate.reportCard && window.open(candidate.reportCard, '_blank')}
              >
                {candidate.reportCard ? 'Show Report' : 'N/A'}
              </div>
              <div className='hidden lg:block text-center'>
                {candidate?.percentage != null
                  ? `${candidate.percentage}% ${candidate.percentage > 50 ? '(Passed)' : '(Failed)'}`
                  : 'N/A'}
              </div>
              {userDetails.userType == 'admin' && <div className='hidden lg:block text-center'>{candidate.invitedBy}</div>}
              <div className='hidden lg:block text-center'>
                {candidate.ratings ? <Ratings rating={candidate.ratings} /> : 'N/A'}
              </div>

              {/* Mobile View */}
              <div className='lg:hidden space-y-1'>
                <div><strong>Name:</strong> {candidate.candidateName}</div>
                <div>
                  <strong>Email:</strong>{' '}
                  <span
                    className='text-blue-600 underline cursor-pointer'
                    onClick={() => {
                      setShowEmail(candidate.candidateEmail);
                      emailRef.current.showModal();
                    }}
                  >
                    Show Email
                  </span>
                </div>
                <div><strong>Date:</strong> {formatDate(candidate.startTime)}</div>
                <div><strong>Time Slot:</strong> {formatTime(candidate.startTime)} - {formatTime(candidate.endTime)}</div>
                <div><strong>Status:</strong> {candidate.testStatus}</div>
                <div>
                  <strong>Report:</strong>{' '}
                  {candidate.reportCard ? (
                    <span
                      className='text-blue-600 underline cursor-pointer'
                      onClick={() => window.open(candidate.reportCard!, '_blank')}
                    >
                      Show Report
                    </span>
                  ) : 'N/A'}
                </div>
                <div>
                  <strong>Percentage:</strong>{' '}
                  {candidate?.percentage != null
                    ? `${candidate.percentage}% ${candidate.percentage > 50 ? '(Passed)' : '(Failed)'}`
                    : 'N/A'}
                </div>
                {userDetails.userType == 'admin' && <div><strong>Invited By:</strong> {candidate.invitedBy}</div>}
                <div><strong>Ratings:</strong> {candidate.ratings ? <Ratings rating={candidate.ratings} /> : 'N/A'}</div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500 py-10'>No candidates found.</div>
        )}
      </div>
    </div>
  );
};

export default AllCandidates;
