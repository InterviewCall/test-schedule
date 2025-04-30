'use client';
import 'react-datepicker/dist/react-datepicker.css';

import axios, { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
// import { addMinutes } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import {
  FormEvent,
  MouseEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';

import Loader from '@/components/Loader';
import Ratings from '@/components/Ratings';
import { advisorOptions } from '@/constants';
import { UserContext } from '@/contexts/UserContext';
import {
  Details,
  ErrorResponse,
  OptionType,
  Test,
  TestResponse,
} from '@/types';
import { formatDate, formatTime } from '@/utils';

const Select = dynamic(() => import('react-select'), { ssr: false });

// const candidates = [
//   {
//     name: 'John Doe',
//     email: 'arijeetganguli32@gmail.com',
//     dateOfTest: '05 April, 2025',
//     startTime: '10:00 AM',
//     endTime: '11:00 AM',
//     status: 'Completed',
//     report: 'View Report',
//     percentage: '85%',
//     advisor: 'Abhishek Kaushik',
//   },

//   {
//     name: 'John Doe',
//     email: 'arijeetganguli32@gmail.com',
//     dateOfTest: '05 April, 2025',
//     startTime: '10:00 AM',
//     endTime: '11:00 AM',
//     status: 'Completed',
//     report: 'View Report',
//     percentage: '85%',
//     advisor: 'Amit Jane',
//   },

//   {
//     name: 'John Doe',
//     email: 'arijeetganguli32@gmail.com',
//     dateOfTest: '05 April, 2025',
//     startTime: '10:00 AM',
//     endTime: '11:00 AM',
//     status: 'Completed',
//     report: 'View Report',
//     percentage: '85%',
//     advisor: 'Amit Jane',
//   },
//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '2:00 PM',
//     endTime: '3:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },

//   {
//     name: 'Jane Smith',
//     email: 'jane@example.com',
//     dateOfTest: '06 April, 2025',
//     startTime: '02:00 PM',
//     endTime: '03:00 PM',
//     status: 'Pending',
//     report: 'N/A',
//     percentage: 'N/A',
//     advisor: 'Md Mandal',
//   },
// ];

export default function Home() {
  const { userDetails } = useContext(UserContext);
  const [test, setTest] = useState<Test[]>([]);
  const [showCandidates, setShowCandidates] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [dateOfTest, setDateOfTest] = useState<Date | null>(null);
  // const [updateDateOfTest, setUpdateDateOfTest] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [updateStartTime, setUpdateStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [updateEndTime, setUpdateEndTime] = useState<Date | null>(null);
  const [updateEmail, setUpdateEmail] = useState('');
  const [showeEmail, setShowEmail] = useState('');
  const [selectAdvisor, setSelecteAdvisor] = useState<OptionType | null>(null);
  const [formData, setFormData] = useState<Details>({
    candidateName: '',
    candidateEmail: '',
  });
  const emailRef = useRef<HTMLDialogElement>(null!);
  const slotUpdateRef = useRef<HTMLDialogElement>(null!);
  const router = useRouter();

  useEffect(() => {
    if (userDetails === undefined) return;

    if (!userDetails) {
      router.replace('/login');
    } else {
      const showCandidate = sessionStorage.getItem('showCandidate');
      if (showCandidate) {
        setShowCandidates(true);
        fetchTests();
      }
    }
    // console.log(test);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  useEffect(() => {
    console.log(test);
  }, [test]);

  const fetchTests = async () => {
    try {
      if (!showCandidates) {
        setShowCandidates(true);
        sessionStorage.setItem('showCandidate', JSON.stringify(true));
      }
      setLoading(true);
      const response: AxiosResponse<TestResponse> =
        await axios.get('/api/get-tests');
      setTest(response.data.data);
    } catch (error) {
      console.log(error);
      const err = error as AxiosError<ErrorResponse>;
      const message = err.response?.data.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('/api/schedule-test', {
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        startTime,
        endTime,
        invitedBy: selectAdvisor?.value,
      });

      setLoading(false);
      toast.success('Successfully scheduled a test');

      if (response.status == 200) {
        setFormData({
          candidateName: '',
          candidateEmail: '',
        });
        setStartTime(null);
        setEndTime(null);
        setSelecteAdvisor(null);
        fetchTests();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setLoading(false);
      setFormData({
        candidateName: '',
        candidateEmail: '',
      });
      setStartTime(null);
      setEndTime(null);
      setSelecteAdvisor(null);
      const message = error.response.data.message;
      toast.error(message);
    }
  };

  async function updateTimeSlot(e: FormEvent) {
    e.preventDefault();
    try {
      slotUpdateRef.current.close();
      setLoading(true);
      await axios.put('/api/update-schedule', {
        updateEmail,
        updateStartTime,
        updateEndTime,
      });
      setLoading(false);
      toast.success('Successfully updated the schedule');
      fetchTests();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response.data.message;
      toast.error(message);
    } finally {
      setUpdateEmail('');
      setUpdateStartTime(null);
      setUpdateEndTime(null);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  function handleUpdate(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    slotUpdateRef.current.showModal();
  }

  if (!userDetails)
    return (
      <div className="bg-white h-[100dvh]">
        <Loader />
      </div>
    );

  return (
    <main className="w-full min-h-[100dvh] bg-white relative">
      {loading && <Loader />}
      <dialog id="my_modal_1" className="modal" ref={emailRef}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Email Address</h3>
          <p className="py-4">{showeEmail}</p>
          <div className="modal-action">
            <form>
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={(e) => {
                  e.preventDefault();
                  emailRef.current.close();
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog
        id="my_modal_2"
        className="modal overflow-visible z-[998]"
        ref={slotUpdateRef}
      >
        <div className="modal-box bg-white overflow-visible">
          {/* <h3 className='font-bold text-lg'>Email Address</h3> */}
          {/* <p className='py-4'>{showeEmail}</p> */}
          <div className="overflow-visible">
            <form className="flex flex-col gap-y-4" onSubmit={updateTimeSlot}>
              <input
                id="updateEmail"
                type="text"
                name="updateEmail"
                autoComplete="off"
                value={updateEmail}
                onChange={(e) => setUpdateEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                placeholder="Enter Email"
                required
              />

              {/* <DatePicker
                selected={updateDateOfTest}
                onChange={(date) => {
                  setUpdateDateOfTest(date);
                }}
                dateFormat="dd MMMM, yyyy"
                minDate={new Date()}
                placeholderText="Select Date"
                popperPlacement="bottom"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              /> */}

                  <DatePicker
                    selected={updateStartTime}
                    onChange={(date) => {
                      setUpdateStartTime(date);
                      setUpdateEndTime(null); // Reset end time when start changes
                    }}
                    showTimeSelect
                    dateFormat="dd MMM yyyy, h:mm aa"
                    minDate={new Date()}
                    placeholderText="Select Start Date & Time"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  />

                <DatePicker
                  selected={updateEndTime}
                  onChange={(date) => setUpdateEndTime(date)}
                  showTimeSelect
                  dateFormat="dd MMM yyyy, h:mm aa"
                  minDate={updateStartTime || new Date()}
                  // minTime={updateStartTime ? addMinutes(updateStartTime, 30) : undefined}
                  // maxTime={updateStartTime ? addMinutes(updateStartTime, 120) : undefined}
                  disabled={!updateStartTime}
                  placeholderText="Select End Date & Time"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-success" type="submit">
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={(e) => {
                  e.preventDefault();
                  slotUpdateRef.current.close();
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 pt-8 mb-8">
          Test Management
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Create New Test
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  id="candidateName"
                  type="text"
                  name="candidateName"
                  autoComplete="off"
                  value={formData.candidateName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="candidateEmail"
                  type="text"
                  name="candidateEmail"
                  autoComplete="off"
                  value={formData.candidateEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter Email"
                  required
                />
              </div>

              {/* <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Date
                </label>

                <DatePicker
                  selected={dateOfTest}
                  onChange={(date) => {
                    setDateOfTest(date);
                  }}
                  dateFormat="dd MMMM, yyyy"
                  minDate={new Date()}
                  placeholderText="Select Date"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
                <input
                  id='email'
                  type='email'
                  name='email'
                  autoComplete='off'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
                  required
                />
              </div> */}
              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Time Slot
                </label>
                  {/* <DatePicker
                    selected={startTime}
                    onChange={(time) => {
                      setStartTime(time);
                      setEndTime(null); // Reset end time when start time changes
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30} // Allows only 30-minute intervals
                    timeFormat="h:mm aa"
                    dateFormat="h:mm aa"
                    placeholderText="Select Start Time"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  /> */}

                  <DatePicker
                    selected={startTime}
                    onChange={(date) => {
                      setStartTime(date);
                      setEndTime(null); // Reset end time when start changes
                    }}
                    showTimeSelect
                    dateFormat="dd MMM yyyy, h:mm aa"
                    minDate={new Date()}
                    placeholderText="Select Start Date & Time"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  />

                  {/* <DatePicker
                    selected={endTime}
                    onChange={(time) => {
                      setEndTime(time);
                    }}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={30}
                    timeFormat="h:mm aa"
                    dateFormat="h:mm aa"
                    placeholderText="Select End Time"
                    minTime={startTime ? addMinutes(startTime, 30) : undefined} // Ensures 30-min gap
                    maxTime={startTime ? addMinutes(startTime, 60) : undefined}
                    disabled={!startTime} // Enable only after selecting start time
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  /> */}

                  {/* <DatePicker
                    selected={endTime}
                    onChange={(date) => setEndTime(date)}
                    showTimeSelect
                    dateFormat="dd MMM yyyy, h:mm aa"
                    minDate={startTime || new Date()}
                    minTime={startTime ? addMinutes(startTime, 30) : undefined}
                    maxTime={startTime ? addMinutes(startTime, 120) : undefined}
                    disabled={!startTime}
                    placeholderText="Select End Date & Time"
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  /> */}
                </div>
                {/* <input
                  id='address'
                  type='text'
                  name='address'
                  autoComplete='off'
                  value={formData.address}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
                  required
                /> */}

              <div className="space-y-2">
              <label
                  htmlFor="address"
                  className="text-sm block font-medium text-gray-700 md:opacity-0 max-md:hidden"
                >
                  Select Time Slot
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  dateFormat="dd MMM yyyy, h:mm aa"
                  minDate={startTime || new Date()}
                  // minTime={startTime ? addMinutes(startTime, 30) : undefined}
                  // maxTime={startTime ? addMinutes(startTime, 60) : undefined}
                  disabled={!startTime}
                  placeholderText="Select End Date & Time"
                  className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Invited By
                </label>

                <Select
                  options={advisorOptions}
                  value={selectAdvisor}
                  placeholder="Select Advisor Name"
                  onChange={(newValue) =>
                    setSelecteAdvisor(newValue as OptionType)
                  }
                  className="text-black"
                  isSearchable
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      padding: '0.15rem',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                    }),
                  }}
                />
                {/* <input
                  id='occupation'
                  type='text'
                  name='occupation'
                  autoComplete='off'
                  value={formData.occupation}
                  onChange={handleChange}
                  className='w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
                  required
                /> */}
              </div>
            </div>

            <div className="flex gap-x-6">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-2 bg-blue-600 cursor-pointer text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Create Test
              </button>

              <button
                onClick={handleUpdate}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 cursor-pointer text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Update Time Slot
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md text-black">
          <h2 className="text-xl font-semibold text-gray-700 p-6 border-b">
            Candidate List
          </h2>

          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-9 bg-gray-50 text-[12px] font-medium text-gray-500 tracking-wider text-center p-3">
              {[
                'Name',
                'Email',
                'Date Of Test',
                'Time Slot',
                'Status',
                'Report',
                'Percentage',
                'Invited By',
                'Ratings',
              ].map((header) => (
                <div key={header} className="p-2 uppercase border-b font-bold">
                  {header}
                </div>
              ))}
            </div>

            {!showCandidates && (
              <div className="h-[200px] flex justify-center items-center">
                <button
                  className="btn btn-accent text-white"
                  onClick={fetchTests}
                >
                  Show Candidates
                </button>
              </div>
            )}

            {showCandidates && test.length == 0 && (
              <div className="h-[200px] flex justify-center items-center">
                No Test Schedules Right Now
              </div>
            )}

            {/* Candidates List */}
            {test.length > 0 &&
              showCandidates == true &&
              test.map((candidate, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 text-xs lg:grid-cols-9 bg-white border-b hover:bg-gray-50 transition"
                >
                  {/* Desktop (grid items) */}
                  <div className="hidden lg:block p-2 text-center">
                    {candidate.candidateName}
                  </div>
                  <div
                    className="hidden lg:block p-2 text-center cursor-pointer hover:text-blue-600 duration-500"
                    onClick={() => {
                      setShowEmail(candidate.candidateEmail);
                      emailRef.current.showModal();
                    }}
                  >
                    Show Email
                  </div>
                  <div className="hidden lg:block p-2 text-center">
                    {formatDate(candidate.startTime)}
                  </div>
                  <div className="hidden lg:block p-2 text-center">{`${formatTime(candidate.startTime)}-${formatTime(candidate.endTime)}`}</div>
                  <div className="hidden lg:block p-2 text-center">
                    {candidate.testStatus}
                  </div>
                  <div
                    className={clsx(
                      'hidden lg:block p-2 text-center',
                      candidate.reportCard
                        ? 'cursor-pointer hover:text-blue-600 duration-500'
                        : 'pointer-events-none'
                    )}
                    onClick={() => window.open(candidate.reportCard!, '_blank')}
                  >
                    {candidate.reportCard ? 'Show Report' : 'N/A'}
                  </div>
                  <div className="hidden lg:block p-2 text-center">
                    {candidate?.percentage != null
                      ? candidate.percentage > 50
                        ? `${candidate.percentage}% (passed)`
                        : `${candidate.percentage}% (failed)`
                      : 'N/A'}
                  </div>
                  <div className="hidden lg:block p-2 text-center">
                    {candidate.invitedBy}
                  </div>
                  <div className="hidden lg:block p-2 text-center">
                    {!candidate.ratings ? (
                      'N/A'
                    ) : (
                      <Ratings rating={candidate.ratings} />
                    )}
                  </div>

                  {/* Mobile (Card format) */}
                  <div className="block lg:hidden p-4">
                    <div className="mb-2">
                      <span className="font-semibold">Name:</span>{' '}
                      {candidate.candidateName}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Email:</span>
                      <span
                        className="text-blue-600 underline cursor-pointer ml-1"
                        onClick={() => {
                          setShowEmail(candidate.candidateEmail);
                          emailRef.current.showModal();
                        }}
                      >
                        Show Email
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Date Of Test:</span>{' '}
                      {formatDate(candidate.startTime)}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Time Slot:</span>{' '}
                      {`${formatTime(candidate.startTime)}-${formatTime(candidate.endTime)}`}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Status:</span>{' '}
                      {candidate.testStatus}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Report:</span>
                      {candidate.reportCard ? (
                        <span
                          className="text-blue-600 underline cursor-pointer ml-1"
                          onClick={() =>
                            window.open(candidate.reportCard!, '_blank')
                          }
                        >
                          Show Report
                        </span>
                      ) : (
                        <span className="ml-1">N/A</span>
                      )}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Percentage:</span>{' '}
                      {candidate?.percentage != null
                        ? candidate.percentage > 50
                          ? `${candidate.percentage}% (passed)`
                          : `${candidate.percentage}% (failed)`
                        : 'N/A'}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Invited By:</span>{' '}
                      {candidate.invitedBy}
                    </div>
                    <div>
                      <span className="font-semibold">Ratings:</span>{' '}
                      {!candidate.ratings ? (
                        ' N/A'
                      ) : (
                        <Ratings rating={candidate.ratings} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </main>
  );
}

{
  /* <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Date Of Test</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Start Time</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>End Time</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Report</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Percentage</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {people.map((person) => (
                  <tr key={person.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{person.name}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{person.age}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{person.email}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{person.address}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{person.occupation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */
}

{
  /* <div className='bg-white rounded-lg shadow-md'>
<h2 className='text-xl font-semibold text-gray-700 p-6 border-b'>
  Candidate List
</h2>

<div className='max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100'>
  <div className='grid grid-cols-9 bg-gray-50 text-[12px] font-medium text-gray-500 tracking-wider text-center p-3'>
    {[
      'Name',
      'Email',
      'Date Of Test',
      'Time Slot',
      'Status',
      'Report',
      'Percentage',
      'Invited By',
      'Ratings'
    ].map((header) => (
      <div
        key={header}
        className='p-2 uppercase border-b font-bold text-center'
      >
        {header}
      </div>
    ))}

    {test.length > 0 && test.map((candidate, index) => (
      <Fragment key={index}>
        <div
          className='p-2 border-b text-center'
        >
          {candidate.candidateName}
        </div>
        <div
          className='p-2 border-b text-center cursor-pointer hover:text-blue-600 duration-500'
          onClick={() => {
            setShowEmail(candidate.candidateEmail);
            emailRef.current.showModal();
          }}
        >
          Show Email
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {formatDate(candidate.dateOfTest)}
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {`${formatTime(candidate.startTime)}-${formatTime(candidate.endTime)}`}
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {candidate.testStatus}
        </div>
        <div
          className={clsx('p-2 border-b text-center', candidate.reportCard ? 'cursor-pointer hover:text-blue-600 duration-500' : 'pointer-events-none')}
          onClick={() => window.open(candidate.reportCard!, '_blank')}
        >
          {candidate.reportCard ? 'Show Report' : 'N/A'}
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {candidate?.percentage != null ? (candidate.percentage > 50 ? `${candidate.percentage}% (passed)` : `${candidate.percentage}% (failed)`) : 'N/A'}
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {candidate.invitedBy}
        </div>
        <div
          className='p-2 border-b text-center'
        >
          {!candidate.ratings ? 'N/A' : <Ratings rating={candidate.ratings} />}
        </div>
      </Fragment>
    ))}
  </div>
</div>
</div> */
}
