import Image from 'next/image'
import dynamic from 'next/dynamic'
// import { Inter } from 'next/font/google'
import Calendar from '../components/calendar'
import PieChart from '../components/pieChart'

// const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("../layout"))

export default function Main({ children }) {

  const userData = {
    data: {
      id: 1,
      name: "Sheva",
      dateOfBirth: "5 March 2002",
      email: "sheva@gmail.com"
    }
  }

  const tablets = {
    data: {
      tabletsCount: 4,
    }
  }

  return (
    <>
      <LayoutComponent>
        <div className='lg:h-screen'>
          <div className='container mx-auto'>
            <div className='flex flex-wrap h-screen'>
              <div className='w-full px-4 lg:w-1/4 pt-10 flex flex-col justify-between'>
                <div className='border rounded-2xl py-4 px-3 bg-rose-50 border-rose-400 font-medium text-lg'>
                  <h3>{userData.data.name}</h3>
                  <h3>{userData.data.dateOfBirth}</h3>
                  <h3>{userData.data.email}</h3>
                  <button
                  // onClick={() => {
                  //   closeDropdowns();
                  //   HandleLogout();
                  // }}
                  className="text-base font-normal px-3 py-1 mt-2 hover:opacity-90 border rounded-2xl bg-red-400 text-white"
                >
                  Logout
                </button>
                </div>
                <div className="mt-auto">
                  <Image src="/home-fig.png" width={260} height={260} />
                </div>
              </div>

              <div className='w-full px-4 lg:w-2/4 my-auto'>
                <Calendar />
              </div>

              <div className='w-full px-4 lg:w-1/4 my-auto'>
                <div className='border rounded-2xl py-4 px-4 lg:px-2 bg-rose-50 border-rose-400'>
                  <h2 className='font-bold text-3xl text-center pb-3'>Riwayat Konsumsi</h2>
                  <p className='font-medium text-lg pl-2'>{tablets.data.tabletsCount}/10 Tablet</p>
                  <PieChart consumedCount={tablets.data.tabletsCount} maxCount={10} />
                </div>
              </div>

            </div>
          </div>
        </div>
      </LayoutComponent>
    </>
  )
}
