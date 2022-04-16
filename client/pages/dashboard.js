import React , { useEffect, useState } from "react";
import jwt from 'jsonwebtoken'
import Popup from "../components/popup";
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { HomeIcon } from "@heroicons/react/outline";
import Image from "next/image"

const Dashboard = () => {

    const [popup, setPopup] = useState({
        state : false,
        message : ""
    });
    const [userInfo, setUserInfo] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    async function verifyUser(){
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/login", {
          headers: {
            'user-token': token
          }
        });
    
        const data = res.data;
    
        if(data.userExists){
            const decodedInfo = jwt.decode(token);
            setUserInfo(decodedInfo);
            setLoggedIn(true);
        }else{
            setPopup({
                state : true,
                message : "You are not logged in ..."
            })
        }
    }

    useEffect(()=>{
        verifyUser();
    },[])

    function deleteUser(){

    }

    function logout(){
        localStorage.clear();
        router.push("./login");
    }

    return(
        <div>
            <Head><title>Student | Dashboard</title></Head>

            {!loggedIn ? 
                <div className="h-[100vh] flex flex-col items-center justify-center">
                    <span>Some error occured. Try logging in again</span>
                    <button
                    onClick={()=>{
                        router.push("../")
                    }}
                    className="my-3 border-2 py-1 px-2 rounded-md border-gray-700 bg-blue-500 font-semibold text-white">Home</button>
                </div>
            : 

                <>
                    <div className="grid grid-cols-3 bg-gray-700 text-white py-3">
                        <div className="flex items-center justify-center">
                            <h1 className="font-semibold text-[1.5rem] flex items-center justify-center cursor-pointer" onClick={()=>{
                                router.push("../")
                            }}><HomeIcon className="w-[2.5rem]" />  Dashboard</h1>
                        </div>
                        <div className="flex flex-col items-start justify-center">
                            <span className="text-[1.15rem]"> <span className="italic underline">Name </span> <span className="font-semibold mx-2"> : {userInfo.name}</span> </span>
                            <span className="text-[1.15rem]"> <span className="italic underline">Roll No.</span> <span className="font-semibold mx-2"> : {userInfo.rollNo}</span> </span>
                        </div>
                        <div className="flex items-center justify-center">
                            <button className="text-black font-semibold px-6 py-2 mx-3 rounded-md text-[1.15rem] bg-gray-200 border-2 border-gray-200 duration-300 hover:bg-gray-100" onClick={()=>{
                                logout();
                            }}>Logout</button>
                            <button className="text-black font-semibold px-6 py-2 mx-3 rounded-md text-[1.15rem] bg-red-500 border-2 border-red-500 duration-300 hover:bg-red-400" onClick={()=>{
                                deleteUser()
                            }}>Delete User</button>
                        </div>
                    </div>
                    

                    <div className="grid grid-cols-2 pt-6">

                        <div className="flex justify-center items-center py-2">
                            <div onClick={()=>{
                                router.push("/courses")
                            }} className="flex flex-col items-center cursor-pointer border-2 rounded-md border-black duration-100 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500">
                                <Image
                                    width="400"
                                    height="225"
                                    src="/courses.png"
                                />
                                <button className="bg-red-400 text-white text-[1.15rem] font-semibold hover:bg-red-500 duration-300 w-[100%] py-2 rounded-b-md">All Courses</button>
                            </div>
                        </div>

                        <div className="flex justify-center items-center py-2">
                            <div onClick={()=>{
                                router.push("/my-classes")
                            }} className="flex flex-col items-center cursor-pointer border-2 rounded-md border-black duration-100 hover:scale-105 hover:shadow-2xl hover:shadow-gray-500">
                                <Image
                                    width="400"
                                    height="225"
                                    src="/yourCourses.png"
                                />
                                <button className="bg-red-400 text-white text-[1.15rem] font-semibold hover:bg-red-500 duration-300 w-[100%] py-2 rounded-b-md">Your Classes</button>
                            </div>
                        </div>

                    </div>

                </>

            }

            {popup.state && <Popup popup={popup} setPopup={setPopup}/> }
        </div>
    )
}

export default Dashboard;