import Image from 'next/image'
import dynamic from 'next/dynamic'
import Header from '../components/header'

// const inter = Inter({ subsets: ['latin'] })
const LayoutComponent = dynamic(() => import("../layout"))

export default function Main() {

  const materiTTD = [
    {
      text: 'Konsumsi gizi seimbang sebelum minum TTD',
      imageSrc: '/ttd-1.png',
      alt: 'Materi ttd 1'
    },
    {
      text: 'Konsumsi TTD secara rutin 1 tablet tiap minggu',
      imageSrc: '/ttd-2.png',
      alt: 'Materi ttd 2'
    },
    {
      text: 'Konsumsi TTD dengan air putih',
      imageSrc: '/ttd-3.png',
      alt: 'Materi ttd 3'
    },
    {
      text: 'Jangan konsumsi TTD dengan teh, kopi, atau susu',
      imageSrc: '/ttd-4.png',
      alt: 'Materi ttd 4'
    },
    {
      text: 'Konsumsi buah-buahan sumber vitamin C, seperti jeruk, mangga, pepaya, jambu biji, dan lain-lain',
      imageSrc: '/ttd-5.png',
      alt: 'Materi ttd 5'
    },
    {
      text: 'Sertai dengan konsumsi makanan gizi seimbang, cukup protein, dan tinggi zat besi',
      imageSrc: '/ttd-6.png',
      alt: 'Materi ttd 6'
    }
  ];

  const efekTTD = [
    {
      text: 'Jangan minum TTD saat perut kosong',
      imageSrc: '/efek-1.png',
      alt: 'efek ttd 1',
      bg: 'bg-bg2'
    },
    {
      text: 'Jangan khawatir jika ulu hati terasa perih, mual, serta tinja berwarna kehitaman. Hal ini akan berkurang jika tubuh sudah menyesuaikan',
      imageSrc: '/efek-2.png',
      alt: 'efek ttd 2',
      bg: 'bg-bg3'
    },
    {
      text: 'Selalu konsumsi Gizi Seimbang',
      imageSrc: '/efek-3.png',
      alt: 'efek ttd 3',
      bg: 'bg-bg2'
    },
  ]


  return (
    <>
      <LayoutComponent>
        <Header />
        <div className='flex flex-col items-center'>
          <div className='bg-bg1 w-full'>
            <div className='container mx-auto px-6 pt-20'>
              <div className='flex flex-col items-center text-center text-white'>
                <div className='relative w-72 h-72 md:w-[28rem] md:h-[26rem]'>
                  <Image
                    src='/hero-fig.png'
                    alt="Tablet Tambah Darah"
                    layout='fill'
                    objectFit='cover'
                    className='rounded-xl'
                    priority 
                  />
                </div>
                <h1 className='text-2xl md:text-4xl pt-4 font-bold mt-4'>APA ITU TABLET TAMBAH DARAH (TTD)?</h1>
                <p className='text-sm md:text-lg mt-2 pb-8'>
                  Tablet Tambah Darah (TTD) adalah tablet yang mengandung minimal 60 mg zat besi dan 0,4 mg asam folat, baik yang disediakan oleh pemerintah atau didapatkan sendiri.
                </p>
              </div>
            </div>
          </div>
          
          <div className='bg-bg2 w-full'>
            <div className='container mx-auto p-4 mt-8'>
              <div className='flex flex-col items-center text-center text-red-900'>
                <h1 className='text-2xl md:text-4xl font-bold mt-4'>APA SAJA MANFAAT TTD?</h1>
                <div className='relative w-full md:w-2/3 h-auto mt-4'>
                  <Image
                    src="/manfaat-ttd.png"
                    alt="Manfaat TTD"
                    layout='responsive'
                    width={600}
                    height={400}
                    priority 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='bg-bg3 w-full'>
            <div className='container mx-auto md:p-4 pr-4 py-4 mb-4 mt-8'>
              <div className='flex flex-col items-center text-center text-red-900'>
                <h1 className='text-2xl md:text-4xl font-bold mt-4 mb-6'>BAGAIMANA CARA MENGONSUMSI TTD?</h1>
              </div>

              {materiTTD.map((materi, index) => (
                <div key={index} className='w-full'>
                  <div className='relative inline-block my-2 lg:mx-28'>
                    <div className='bg-bg1 rounded-r-3xl inline-block pr-6'>
                      <p className='px-2 py-2 text-white'>{materi.text}</p>
                    </div>
                    <div className='absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 mr-2 lg:mr-0'>
                      <Image
                        src={materi.imageSrc}
                        alt={materi.alt}
                        width={40}
                        height={40}
                        priority
                      />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>

          <div className='bg-bg4 w-full'>
            <div className='container mx-auto pt-6 mt-8'>
              <div className='flex flex-col items-center text-center text-bg2'>
                <h1 className='text-2xl md:text-4xl font-bold mt-4 mb-6'>
                  APA EFEK SAMPING TTD DAN BAGAIMANA CARA MENGATASINYA?
                </h1>
              </div>
                {/* layout sm */}
                <div className='relative w-full px-3 mx-auto h-auto mt-4 md:hidden'>
                  <Image
                    src="/efek-sm.png"
                    alt="Manfaat TTD"
                    layout="responsive"
                    width={800}
                    height={600}
                    priority 
                  />
                </div>
                {/* layout md - lg */}
                <div className='md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mx-8 pt-4 hidden'>
                {efekTTD.map((efek, index) => (
                  <div key={index} className={`${efek.bg} hidden md:block rounded-t-full shadow-lg overflow-hidden p-4`}>
                    <div className='flex justify-center'>
                      <div className='w-64 h-64 relative'>
                        <Image
                          src={efek.imageSrc}
                          alt={efek.alt}
                          fill
                          objectFit='cover'
                          className='rounded-full'
                          priority 
                        />
                      </div>
                    </div>
                    <div className='p-4 text-center'>
                      <p className='text-gray-900 font-bold text-xl'>{efek.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-red-900 pt-4 w-full text-center'>
            <div className='flex justify-center items-center'>
              <Image
                src="/footer.png"
                alt="manfaat ttd"
                width={150}
                height={80}
                priority 
              />
              <p className='text-white pt-2 pl-2'>Notebook Planner&apos;s</p>
            </div>
          </div>
        </div>

      </LayoutComponent>
    </>
  )
}