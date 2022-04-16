import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import Head from 'next/head';
import { HomeIcon, TrashIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';

import Popup from "../components/popup";

const MyClasses = () => {

    const [classes, setClasses] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [popup, setPopup] = useState({
        state:false,
        message:""
    });

    const router = useRouter();

    function getUserCourses(user){
        let result = [];
        if(user.classes.length===0){
            setClasses([])
        }else{
            user.classes.map(async(e)=>{
                const res = await axios.get("http://localhost:3001/getClass",{
                    headers: {
                        "course-id" : e
                    }
                });
                const data = await res.data;
                setClasses([ ...result , data ])
                result.push(data);
            });
        }
    }

    async function verifyUser(){
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/login",{
            headers: {
                'user-token' : token
            }
        });
        const data = await res.data;
        if(data.userExists){
            localStorage.setItem("token" , data.user);
            const user = jwt.decode(data.user);
            console.log(user);
            setUserInfo(user);
            getUserCourses(user);
            setLoggedIn(true);
        }else{
            setLoggedIn(false);
            setPopup({
                state: false,
                message : "You are not logged in..."
            })
        }
    }

    useEffect(()=>{
        verifyUser();
    },[])

    function StandardTimeConversion(time){
        if(time>0 && time<12){
            return time.toString() + " A.M.";
        }else if(time===0){
            return "12 A.M."
        }else if(time===12){
            return "12 P.M."
        }else{
            return (time-12).toString() + "P.M.";
        }
    }

    function removeItem(arr, item){
        let r = [];
        arr.map((e)=>{
            if(e!==item){
                r.push(e);
            }
        })
        console.log("r: ",r);
        return r;
    }

    async function deleteCourse(classId){
        const newClasses = removeItem(userInfo.classes , classId);

        const res = await axios.post("http://localhost:3001/updateUserClasses", {
            email : userInfo.email,
            classes : newClasses
        });
        const data = await res.data;

        if(data.updated){
            verifyUser();
        }else{
            setPopup({
                state : true,
                message : "Failed to delete the course."
            })
        }
    }

    return(
        <>

        {loggedIn ? 

            <div>
                <Head><title>Your Classes</title></Head>

                <div className='flex items-center justify-center py-5'>
                    <HomeIcon 
                    onClick={()=>{
                        router.push("./dashboard")
                    }}
                    className='w-[3rem] cursor-pointer' />
                </div>

                <div className='flex items-center justify-center'>
                    <h1 className='underline font-bold text-[2rem]'>Taken Courses</h1>
                </div>

                <div className='flex flex-col'>
                    {classes.map((e,index)=>{
                        return(
                            <div 
                            className={index%2===0 ? 'flex items-center mx-[20vw] border-4 my-3 rounded-md py-2 px-3 border-blue-500' : 'flex items-center mx-[20vw] border-4 rounded-md py-2 px-3 border-red-500'}
                            key={"user-classes"+index.toString()}>
                                <div className='flex flex-col w-[95%]'>
                                    <span>Course Name : {e.name}</span>
                                    <span>Course Code : {e.class.courseCode}</span>
                                    <span>Faculty : {e.class.faculty}</span>
                                    <span>Starts at {StandardTimeConversion(e.class.time.startTime)} and ends at {StandardTimeConversion(e.class.time.endTime)} on {e.class.time.day} every week </span>
                                </div>

                                <div className='w-[5%] flex items-center justify-center'>
                                    <TrashIcon onClick={()=>{
                                        deleteCourse(e._id);
                                    }} className='w-[3rem] cursor-pointer' />
                                </div>
                            
                            </div>
                        )
                    })}
                </div>

                {popup.state && <Popup popup={popup} setPopup={setPopup}/>}

            </div>
        :
            <div>
                <button>Login</button>
                <button>Register</button>
            </div>
        }

        </>
    )
}

export default MyClasses