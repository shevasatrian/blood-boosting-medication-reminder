import Image from 'next/image'
import dynamic from 'next/dynamic'
// import { Inter } from 'next/font/google'
import Calendar from '../../components/calendar'
import PieChart from '../../components/pieChart'
import { useQueries } from '../../hooks/useQueries'
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useState, useEffect  } from 'react'

// const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("../../layout"))

export default function Reminder() {
    const router = useRouter();
    const [tabletsCount, setTabletsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const { data } = useQueries({
        prefixUrl: "https://blood-sup.fly.dev/users",
        headers: {
          Authorization: `Bearer ${Cookies.get("user_token")}`,
        }
      });

    useEffect(() => {
        if (data) {
            setIsLoading(false);
        }
    }, [data]);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString("id-ID", options);
        return formattedDate;
    };

    const handleLogout = () => {
        Cookies.remove('user_token'); // Menghapus token dari cookie
        router.push('/login'); // Redirect ke halaman login
      };

      if (isLoading) {
        return (
          <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-red-400" role="status">
                    </div>
                    <p className="mt-4 text-lg">Loading data...</p>
                </div>
            </div>
        );
    }

  return (
    <>
      <LayoutComponent>
        <div className='lg:h-screen'>
          <div className='container mx-auto'>
            <div className='flex flex-wrap h-screen'>
              <div className='w-full px-4 lg:w-1/4 pt-10 flex flex-col justify-between'>
                <div className='border rounded-2xl py-4 px-3 bg-rose-50 border-rose-400 font-medium text-lg'>
                  <h3>{data?.user.name}</h3>
                  <h3>{formatDate(data?.user.birthdate)}</h3>
                  <h3>{data?.user.email}</h3>
                  <button
                  onClick={() => {
                    handleLogout();
                  }}
                  className="text-base font-normal px-3 py-1 mt-2 hover:opacity-90 border rounded-2xl bg-red-400 text-white"
                >
                  Logout
                </button>
                </div>
                <div className="mt-auto">
                  <Image src="/home-fig.png" width={260} height={260} alt="home" priority />
                </div>
              </div>

              <div className='w-full px-4 lg:w-2/4 my-auto'>
                <Calendar onConsumptionsUpdate={setTabletsCount} />
              </div>

              <div className='w-full px-4 lg:w-1/4 my-auto'>
                <div className='border rounded-2xl py-4 px-4 lg:px-2 bg-rose-50 border-rose-400'>
                  <h2 className='font-bold text-3xl text-center pb-3'>Riwayat Konsumsi</h2>
                  <p className='font-medium text-lg pl-2'>{tabletsCount}/10 Tablet</p>
                  <PieChart consumedCount={tabletsCount} maxCount={10} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </LayoutComponent>
    </>
  )
}
