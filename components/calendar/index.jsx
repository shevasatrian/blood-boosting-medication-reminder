// import { Menu, Transition } from '@headlessui/react'
// import { DotsVerticalIcon } from '@heroicons/react/outline'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  // isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns'
import { useState, useEffect } from 'react'
import { useMutation } from '../../hooks/useMutation'
import Cookies from "js-cookie";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Modal from 'react-modal';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar({ onConsumptionsUpdate }) {
  
  const { mutate } = useMutation();
  const router = useRouter();

  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  const [meetings, setMeetings] = useState([]);
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  const [eventAddedMap, setEventAddedMap] = useState({});
  const [lastId, setLastId] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dayToCancel, setDayToCancel] = useState(null);

  const toast = useToast();

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  const fetchData = async () => {
    const year = format(firstDayCurrentMonth, 'yyyy');
    const month = format(firstDayCurrentMonth, 'MM');
    const response = await fetch(`https://blood-sup.fly.dev/getdrugconsumption?month=${month}&year=${year}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${Cookies.get("user_token")}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    const updatedEventAddedMap = {};
    data.consumptions.forEach((event) => {
      const dateKey = format(parseISO(event.consume_at), 'yyyy-MM-dd');
      updatedEventAddedMap[dateKey] = event.ID;
    });
    setEventAddedMap(updatedEventAddedMap);
    setMonthlyCount(data.consumptions.length)
    if (onConsumptionsUpdate) {
      onConsumptionsUpdate(data.consumptions.length);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
  }

  // let selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.startDatetime), selectedDay)
  // )

  async function addDefaultEvent(selectedDay) {
    const selectedDateKey = format(selectedDay, 'yyyy-MM-dd');
    if (eventAddedMap[selectedDateKey]) {
      // console.log("Date already marked.");
      toast({
        title: "Gagal Menandai",
        description: "Tanggal tersebut sudah ditandai",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (monthlyCount >= 10) {
      // console.log("Maximum of 10 events per month reached.");
      toast({
        title: "Gagal Menandai",
        description: "Sudah mencapai jumlah maksimum bulanan",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    toast({
      title: "Tanggal berhasil ditandai",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top",
    });

    await setEventAddedMap(prevState => ({
      ...prevState,
      [selectedDateKey]: lastId,
    }));

    setLastId(lastId + 1);
    setMonthlyCount(monthlyCount + 1);
    if (onConsumptionsUpdate) {
      onConsumptionsUpdate(monthlyCount + 1);
    }
    

    const newPayload = {
      consume_at: selectedDay.toISOString(),
      IsEmailSended: false,
    };

    try {
      const response = await mutate({
        url: 'https://blood-sup.fly.dev/drugconsumption',
        payload: newPayload,
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
          'Content-Type': 'application/json'
        }
      });
      if (response && response.ID) {
        setEventAddedMap(prevState => ({
          ...prevState,
          [selectedDateKey]: response.ID, // Update the ID with the response ID
        }));
      }
      router.reload();
      // console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function handleCancel() {
    if (!dayToCancel) return;
    const selectedDateKey = format(dayToCancel, 'yyyy-MM-dd');
    const eventId = eventAddedMap[selectedDateKey];

    if (!eventId) {
      console.log("No event to cancel for this date.");
      return;
    }

    try {
      const response = await fetch(`https://blood-sup.fly.dev/deleteconsumption/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast({
          title: "Tanggal berhasil dibatalkan",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });

        setMeetings(meetings.filter(meeting => meeting.id !== eventId));
        setEventAddedMap(prevState => {
          const newState = { ...prevState };
          delete newState[selectedDateKey];
          return newState;
        });
        setMonthlyCount(monthlyCount - 1);
        if (onConsumptionsUpdate) {
          onConsumptionsUpdate(monthlyCount - 1);
        }
      } else {
        console.error("Failed to delete the event. Status:", response.status);
        toast({
          title: "Gagal Membatalkan",
          description: "Terjadi kesalahan saat membatalkan tanggal",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
      router.reload();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Gagal Membatalkan",
        description: "Terjadi kesalahan saat membatalkan tanggal",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
    setIsModalOpen(false);
  }

  function openModal(day) {
    setDayToCancel(day);
    setIsModalOpen(true);
  }

  function closeModal() {
    setDayToCancel(null);
    setIsModalOpen(false);
  }

  return (
    <div className="pt-4">
        <div className="md:grid md:grid-cols-1 md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
              <div>
                {/* Tombol untuk menambahkan event dengan pesan default */}
                {/* onClick={() => addDefaultEvent(selectedDay)} */}
                <button onClick={() => { addDefaultEvent(selectedDay);}} className="border rounded-lg px-2 py-1 bg-sky-200 border-sky-300 hover:opacity-90">
                  Tandai tanggal {format(selectedDay, 'dd MMMM yyyy')}
                </button>
                {/* {eventAdded && <p>Event sudah ditambahkan untuk tanggal ini.</p>} */}
                {eventAddedMap[format(selectedDay, 'yyyy-MM-dd')] !== undefined && (
                <button onClick={() => { openModal(selectedDay); }} className="ml-2 border rounded-lg px-2 py-1 bg-red-200 border-red-300 hover:opacity-90">
                  Cancel
                </button>
                )}
              </div>
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              <div>S</div>
              <div>M</div>
              <div>T</div>
              <div>W</div>
              <div>T</div>
              <div>F</div>
              <div>S</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    'py-1.5'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => isToday(day) && setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && 'text-white',
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        'text-red-500',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-900',
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-gray-400',
                      isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        'bg-gray-900',
                      !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                    )}
                  >
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </button>

                  <div className="w-1 h-1 mx-auto mt-1">
                  {eventAddedMap[format(day, 'yyyy-MM-dd')] !== undefined && (
                    <div className="w-1 h-1 rounded-full bg-sky-500"></div>
                  )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Confirmation Modal"
          className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-gray-500 bg-opacity-75"
          overlayClassName="fixed inset-0">
          <div className="bg-white rounded-lg shadow-xl sm:max-w-lg sm:w-full p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">Are you sure you want to cancel?</h3>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleCancel}
                className="mr-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
                Yes
              </button>
              <button
                onClick={closeModal}
                className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                No
              </button>
            </div>
          </div>
        </Modal>
    </div>
  )
}

let colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]
