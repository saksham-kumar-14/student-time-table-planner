import React , { useState } from "react";
import { EyeIcon , EyeOffIcon, HomeIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import axios from 'axios';
import router from 'next/router';

import Popup from "../components/popup";

const Register = () => {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const [popup, setPopup] = useState({
        state : false,
        message : ""
    })

    async function getUsers(){
        const res = await axios.get("http://localhost:3001/getStudents");
        const data = await res.data;
        return data;
    }

    async function emailExists(email){
        const data = await getUsers();

        let result = false;
        await data.map((e)=>{
            if(e.email === email){
                result = true
            }
        })

        return result;
    }

    async function registerUser(){

        const rawData = await axios.get("http://localhost:3001/getRollNo");
        const data = await rawData.data;
        const rollNo = await data.count + 1;

        const res = await axios.post("http://localhost:3001/createStudent",{
            name : name,
            email : email,
            password : password,
            rollNo : rollNo,
        });
        const userData = await res.data;
        if(userData.user){
            localStorage.setItem("token", userData.user);
        }else{
            setPopup({
                state:true,
                message: userData.error
            });
        }

        router.push("dashboard")
    }

    return(
        <div>
            <div className="h-[10vh] grid grid-cols-2 py-3">
                <div className="flex flex-col justify-center items-center">
                    <div className="text-gray-800 duration-300 hover:text-gray-700">
                        <Link href="./"><a><HomeIcon className="w-[3rem]"/></a></Link>
                        <span className="w-[0.5rem] font-semibold">Home</span>
                    </div>
                </div>
                <div className="flex items-center justify-center">
                    <span className="text-[1.35rem]">Already registered? <Link href="login"><a className="font-semibold text-blue-500">Login</a></Link> </span>
                </div>
            </div>
            <div className="h-[90vh] flex items-center justify-center">
                <Head><title>Register</title></Head>

                <div className="flex flex-col items-start">
                    <h1 className="font-semibold text-[2rem] my-3 text-red-600">Create User</h1>
                    <div className="flex flex-col items-start justify-center">
                        <input onChange={(e)=>{
                            setName(e.target.value)
                        }} placeholder="Your name" type="text" className="w-[35vw] rounded-md outline-none border-2 px-3 py-2 text-[1.15rem] my-2 border-[rgb(10,10,10)] focus:border-blue-500 duration-300"/>
                        <input onChange={(e)=>{
                            setEmail(e.target.value)
                        }} placeholder="Your email" type="text" className="w-[35vw] rounded-md outline-none border-2 px-3 py-2 text-[1.15rem] my-2 border-[rgb(10,10,10)] focus:border-blue-500 duration-300"/>
                        <div className="flex items-center">
                            <input onChange={(e)=>{
                                setPassword(e.target.value)
                            }} placeholder="password" type={passwordType} className="w-[35vw] rounded-md outline-none border-2 px-3 py-2 text-[1.15rem] my-2 border-[rgb(10,10,10)] focus:border-blue-500 duration-300"/>
                            {passwordType==="password"?
                            <EyeIcon className="w-[2.5rem] mx-2 cursor-pointer" onClick={()=>{ setPasswordType("text") }} />:
                            <EyeOffIcon className="w-[2.5rem] mx-2 cursor-pointer" onClick={()=>{ setPasswordType("password") }} />}
                        </div>
                    </div>
                    <button onClick={async()=>{
                        if(name===""||email===""||password===""){
                            setPopup({
                                state : true,
                                message : "Fill the entries properly"
                            })
                        }else{
                            if(await emailExists(email)){
                                setPopup({
                                    state : true,
                                    message : "User with same email already exists .."
                                })
                            }else{
                                registerUser()
                            }
                        }
                    }} className="border-2 border-blue-500 text-white px-5 py-2 rounded-md bg-blue-500 text-[1.25rem] duration-300 hover:bg-blue-400 my-3">Submit</button>
                </div>

            </div>

            {popup.state && <Popup popup={popup} setPopup={setPopup} /> }

        </div>
    )
}

export default Register;