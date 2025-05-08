'use client';
import 'react-datepicker/dist/react-datepicker.css';

import axios from 'axios';
import { addMinutes } from 'date-fns';
// import { addMinutes } from 'date-fns';
import dynamic from 'next/dynamic';
import Link from 'next/link';
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
import { advisorOptions } from '@/constants';
import { UserContext } from '@/contexts/UserContext';
import { Details, OptionType } from '@/types';
import { isValidEmail } from '@/utils';

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
  // const [test, setTest] = useState<Test[]>([]);
  // const [showCandidates, setShowCandidates] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [dateOfTest, setDateOfTest] = useState<Date | null>(null);
  // const [updateDateOfTest, setUpdateDateOfTest] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [updateStartTime, setUpdateStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [updateEndTime, setUpdateEndTime] = useState<Date | null>(null);
  const [updateEmail, setUpdateEmail] = useState('');
  // const [showeEmail, setShowEmail] = useState('');
  const [selectAdvisor, setSelecteAdvisor] = useState<OptionType | null>(null);
  const [updateAdvisor, setUpdateAdvisor] = useState<OptionType | undefined>(undefined);
  const [formData, setFormData] = useState<Details>({
    candidateName: '',
    candidateEmail: '',
  });
  // const emailRef = useRef<HTMLDialogElement>(null!);
  const slotUpdateRef = useRef<HTMLDialogElement>(null!);
  const router = useRouter();
  useEffect(() => {
    if (userDetails === undefined) return;

    if (!userDetails) {
      router.replace('/login');
    } else {
      const showCandidate = sessionStorage.getItem('showCandidate');
      if (showCandidate) {
        // setShowCandidates(true);
        // fetchTests();
      }
    }
    // console.log(test);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if(!isValidEmail(formData.candidateEmail)) {
      toast.error('Invalid email format');
      return;
    }

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
        // fetchTests();
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
    if(!isValidEmail(updateEmail)) {
      toast.error('Invalid email format');
      return;
    }

    try {
      slotUpdateRef.current.close();
      setLoading(true);
      await axios.put('/api/update-schedule', {
        updateEmail,
        updateStartTime,
        updateEndTime,
        invitedBy: updateAdvisor?.value
      });
      setLoading(false);
      toast.success('Successfully updated the schedule');
      // fetchTests();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response.data.message;
      console.log(error);
      toast.error(message);
    } finally {
      setUpdateEmail('');
      setUpdateStartTime(null);
      setUpdateEndTime(null);
      setUpdateAdvisor(undefined);
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

      <dialog
        id="my_modal_2"
        className="modal overflow-visible z-[998]"
        ref={slotUpdateRef}
      >
        <div className="modal-box bg-white overflow-visible">
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
                onChange={(date) => {
                  setUpdateEndTime(date);
                }}
                showTimeSelect
                dateFormat="dd MMM yyyy, h:mm aa"
                minDate={updateStartTime || new Date()}
                minTime={userDetails.userType == 'user' ? updateStartTime ? addMinutes(updateStartTime, 60) : undefined : undefined}
                maxTime={userDetails.userType == 'user' ? updateStartTime ? addMinutes(updateStartTime, 60) : undefined : undefined}
                disabled={!updateStartTime}
                placeholderText="Select End Date & Time"
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
              />
              {/* if there is a button in form, it will close the modal */}

                {userDetails.userType == 'admin' && (
                  <Select
                    options={advisorOptions}
                    value={updateAdvisor}
                    placeholder="Select Advisor Name"
                    onChange={(newValue) =>
                      setUpdateAdvisor(newValue as OptionType)
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
                 />)}
                
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

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Time Slot
                </label>

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
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="address"
                  className="text-sm block font-medium text-gray-700 md:opacity-0 max-md:hidden"
                >
                  Select Time Slot
                </label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => {
                    setEndTime(date);
                  }}
                  showTimeSelect
                  dateFormat="dd MMM yyyy, h:mm aa"
                  minDate={startTime || new Date()}
                  minTime={userDetails.userType == 'user' ? startTime ? addMinutes(startTime, 60) : undefined : undefined}
                  maxTime={userDetails.userType == 'user' ? startTime ? addMinutes(startTime, 60) : undefined: undefined}
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

        <div className="bg-white rounded-lg text-black">
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100">
              <div className="h-[200px] flex justify-center items-center">
                <Link className="btn btn-accent text-white" href="/tests">
                  Show All Tests
                </Link>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}
