'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import Loader from '@/components/Loader';
import Ratings from '@/components/Ratings';
import StatusFilter from '@/components/StatusFilter';
import { UserContext } from '@/contexts/UserContext';
import { Test } from '@/types';
import { formatDate, formatTime } from '@/utils';

const AllCandidates: FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmail, setShowEmail] = useState('');
  const { userDetails } = useContext(UserContext);
  const emailRef = useRef<HTMLDialogElement>(null!);
  const router = useRouter();

  useEffect(() => {
    if (!userDetails) {
      router.replace('/');
    }
  }, [userDetails, router]);

  function updateTests(tests: Test[]) {
    setTests(tests);
  }

  function setLoading(state: boolean) {
    setIsLoading(state);
  }

  return (
    <div className='w-full h-[100dvh] overflow-hidden bg-gray-50 text-black px-4'>
      {isLoading && <Loader />}
      <dialog ref={emailRef} className='modal'>
        <div className='modal-box rounded-xl shadow-lg bg-white'>
          <h3 className='font-bold text-lg'>Email Address</h3>
          <p className='py-4 text-gray-700'>{showEmail}</p>
          <div className='modal-action'>
            <button
              className='btn bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded'
              onClick={(e) => {
                e.preventDefault();
                emailRef.current.close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>

      <StatusFilter updateTests={updateTests} setLoading={setLoading} />

      {/* Desktop View */}
      <div className='hidden sticky lg:grid grid-cols-9 bg-indigo-600 text-white shadow-md rounded-t-md font-semibold text-center'>
        {[
          // 'Select',
          'Name',
          'Email',
          'Date',
          'Time Slot',
          'Status',
          'Report',
          'Percentage',
          'Invited By',
          'Ratings',
        ].map((header) => (
          <div key={header} className='py-3 px-2 border-b'>
            {header}
          </div>
        ))}
      </div>

      <div className='divide-y lg:max-h-[75dvh] max-h-[85dvh] overflow-y-auto divide-gray-200 shadow overflow-hidden rounded-b-md'>
        {tests.length > 0 ? (
          tests.map((candidate, index) => (
            <div
              key={index}
              className={clsx(
                'grid grid-cols-1 lg:grid-cols-9 text-sm bg-white transition py-3 hover:bg-indigo-200',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              )}
            >
              {/* Desktop Cells */}
              {/* <div className='flex justify-center'>
                <input type="checkbox" className="checkbox checkbox-secondary" />
              </div> */}
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
              <div className='hidden lg:block text-center'>{candidate.invitedBy}</div>
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
                <div><strong>Invited By:</strong> {candidate.invitedBy}</div>
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
