import Image from 'next/image'
import dynamic from 'next/dynamic'
// import { Inter } from 'next/font/google'
import Calendar from '../components/calendar'

// Import the functions you need from the SDKs you need


// const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("../layout"))

export default function Main({ children }) {
  return (
    <>
      <LayoutComponent>
        <Calendar />
      </LayoutComponent>
    </>
  )
}
