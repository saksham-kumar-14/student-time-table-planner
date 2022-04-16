import { useEffect, useState } from 'react'
import axios from 'axios';
import { BackspaceIcon, HomeIcon, PlusIcon, SearchIcon } from '@heroicons/react/outline'
import Head from 'next/head';
import Popup from "../components/popup";
import jwt from 'jsonwebtoken';
import { useRouter } from "next/router";

const Courses = () => {

    const router = useRouter();

    const [loggedIn, setLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({});

    const [ allCourses , setAllCourses ] = useState([]);
    const [ currentSearch , setCurrentSearch ] = useState("");
    const [popup, setPopup] = useState({
        state : false,
        message : ""
    });

    const [searched, setSearched] = useState(false);
    const [searchedWord, setSearchedWord] = useState("");

    async function verifyUser(){
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3001/api/login", {
            headers: {
                'user-token' : token
            }
        });
        const data = await res.data;
        if(data.userExists){
            setLoggedIn(true)
        }else{
            setLoggedIn(false)
        }
    }

    async function getCourses(){
        const res = await axios.get("http://localhost:3001/getCourses");
        const data = await res.data;
        setAllCourses(data);
    }

    function getUserData(){
        const token = localStorage.getItem("token");
        const user = jwt.decode(token);
        setUserInfo(user);
    }
    
    useEffect(() => {
        getCourses();
        getUserData();
        verifyUser();
    },[]);

    function selectCourses(){
        setSearched(true);
        setSearchedWord(currentSearch);
        const result = allCourses.filter((item)=>{
            return item.name.toUpperCase() === currentSearch.toUpperCase() 
        })
        setAllCourses(result);
    }

    async function courseInterfering(courseId){
        const res = await axios.get("http://localhost:3001/getClass", {
            headers: {
                'course-id' : courseId
            }
        });
        const data = await res.data;
        const classInfo = await data.class;
        const result = false;
        let takenClasses = [];
        
        allCourses.map((e)=>{
            if(userInfo.classes.includes(e._id)){
                takenClasses.push(e);
            }
        });

        takenClasses.map((e)=>{
            if( ((e.class.time.endTime >= classInfo.time.startTime) && (classInfo.time.startTime >= e.class.time.startTime) && (classInfo.time.day===e.class.time.day) ) || ((e.class.time.endTime>=classInfo.time.endTime) && (classInfo.time.endTime>=e.class.time.startTime) && (classInfo.time.day===e.class.time.day) ) ){
                result = true;
            }
        })

        return result;
    }

    async function addToStudentCourses(courseId){
        const email = userInfo.email;
        const password = userInfo.password;
        const classes = [...userInfo.classes , courseId];

        await axios.post("http://localhost:3001/addCourse", {
            email : email,
            classes : classes
        }).then(()=>{
            setPopup({
                state : true,
                message : "Course added .."
            })
        }).catch(()=>{
            setPopup({
                state : true,
                message : "Some error occured while adding your courses"
            })
        })

        const newToken = jwt.sign({
            name : userInfo.name,
            email : email,
            classes : classes,
            password : userInfo.password,
            rollNo : userInfo.rollNo
        },"secret");
        localStorage.setItem("token", newToken);
        setUserInfo({
            name : userInfo.name,
            email : email,
            classes : classes,
            password : userInfo.password,
            rollNo : userInfo.rollNo
        });
        
    }
    

    return(
        <div className='flex flex-col items-center justify-center'>
            <Head><title>All Courses</title></Head>

            <div className='py-2 flex flex-col justify-center items-center'>
                <button
                 onClick={()=>{
                    router.push("./dashboard")
                 }}
                 className='flex flex-col justify-center items-center'>
                    <HomeIcon className='w-[4rem]' />
                    <span>Home</span>
                </button>
                <h1 className='mt-5 font-bold text-[2rem] underline'>All Courses</h1>
            </div>

            <div className='flex items-center border-2 border-black rounded-md m-4'>
                <input 
                id = "search-course-input"
                onChange={(e)=>{setCurrentSearch(e.target.value)}} 
                placeholder='Search for a course' 
                className='px-5 py-2 text-[1.25rem] w-[40vw]' />
                    
                    <div className='flex items-center'>
                        <button
                        className='py-1 px-2 rounded-r-sm bg-black text-white' 
                        onClick={()=>{
                            document.getElementById("search-course-input").value = "";
                            setCurrentSearch("")
                            selectCourses();
                        }} >
                        <SearchIcon className='w-[2.5rem]' />
                        </button>

                        {searched && 
                            <button 
                            className='rounded-r-sm py-1 px-2 bg-red-500'
                            onClick={()=>{
                                getCourses();
                                setSearched(false);
                                setSearchedWord("");
                            }}>
                                <BackspaceIcon className='w-[2.5rem] text-white' />
                            </button>
                        }
                    </div>
            </div>

            <div className='mt-12 border-2 p-6 rounded-md border-blue-400 bg-blue-500'>

                <div className='flex flex-col justify-center mt-5'>

                    { searched &&
                        <span className='font-bold italic text-[1.5rem] text-white'>Showing results related to "{searchedWord}"</span>
                    }

                    {loggedIn && allCourses.map((e,index)=>{
                        return(
                            
                            <div
                            className="flex items-center bg-white rounded-lg font-semibold w-[30vw] border-2 border-md border-gray-600 my-2 text-[1.15rem]" 
                            key={"courses-"+index}>
                                <div className='w-[85%] p-2'>
                                    <span className=''>{index+1}.</span>
                                    <span className='ml-2'>{e.name}</span>
                                </div>

                                {!userInfo.classes.includes(e._id) &&
                                    <button
                                    onClick={async()=>{
                                        if(await courseInterfering(e._id)){
                                            setPopup({
                                                state : true,
                                                message : "The selected course is interfering with your time table"
                                            })
                                        }else{
                                            addToStudentCourses(e._id);
                                        }
                                    }}
                                    className='w-[15%] flex items-center justify-center py-2 bg-red-500 rounded-r-md'>
                                        <a title='Select this course'>
                                            <PlusIcon className='w-[2.5rem]' />
                                        </a>
                                    </button>
                                }
                            </div>
                        
                        )
                    })}
                </div>
                
            </div>

            {popup.state && <Popup popup={popup} setPopup={setPopup} /> }

        </div>
    )
}

export default Courses;