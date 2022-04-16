import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  async function verifyUser(){
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3001/api/login", {
      headers: {
        'user-token': token
      }
    });

    const data = res.data;

    if(data.userExists){
      setAuthorized(true);
    }else{
      setAuthorized(false);
    }
  }

  useEffect(()=>{
    verifyUser();
  },[])

  return(
    <div className='grid grid-cols-2 h-[100vh]'>

      <Head>
        <title>Student Portal</title>
      </Head>

      <div className='flex items-center justify-center'>
        <Image
          className="rounded"
          alt="hero"
          src="/stockImage.png"
          height="363"
          width="550"
        />
      </div>

      <div className='flex flex-col justify-center'>
        <div className='flex flex-col justify-start'>
          <h1 className='font-semibold text-[2.5rem]'>Time Table Planner</h1>
          <p className='mt-4 text-gray-500'>A single place to plan / draft / manage your classes. Create your timetable and have a look at the calendar and see all your scheduled classes in one place. You can also unenroll in the courses you don't like.</p>
        </div>

        <div className='py-8'>
          {authorized ?
            <button onClick={()=>{
              router.push("/dashboard")
            }} className='text-[1.15rem] px-6 py-2 rounded-md bg-blue-500 duration-300 hover:bg-blue-400 text-white font-semibold '>View</button>:
            <div className='flex items-center justify-start w-[100%]'>
              <button onClick={()=>{
                router.push("/register")
              }} className='px-6 py-2 mr-3 text-[1.15rem] bg-red-500 hover:bg-red-600 text-white duration-300 rounded-md'>Register</button>
              <button onClick={()=>{
                router.push("/login")
              }} className='px-6 py-2 ml-3 text-[1.15rem] bg-gray-100 hover:bg-gray-300 text-black duration-300 rounded-md'>Login</button>
            </div>
          }
        </div>

      </div>

    </div>
  )
}

export default Home;