import React , { useState } from "react";
import { EyeIcon , EyeOffIcon , HomeIcon } from "@heroicons/react/solid";
import Head from "next/head";
import Link from "next/link";
import axios from "axios";
import router from "next/router";

import Popup from "../components/popup";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");

    const [popup, setPopup] = useState({
        state : false,
        message : ""
    })

    async function loginUser(){
        const res = await axios.post("http://localhost:3001/login" , {
            email : email,
            password : password
        });
        const token = res.data;

        if(token.user){
            localStorage.setItem("token", token.user);
            router.push("./dashboard")
        }else{
            setPopup({
                state : true,
                message : "Login failed ...."
            })
        }
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
                    <span className="text-[1.35rem]">Not registered? <Link href="register"><a className="font-semibold text-blue-500">Sign Up</a></Link> </span>
                </div>
            </div>
            <div className="h-[90vh] flex items-center justify-center">

                <Head><title>Login</title></Head>

                <div className="flex flex-col items-start">
                    <h1 className="font-semibold text-[2rem] my-3 text-red-600">Login</h1>
                    <div className="flex flex-col items-start justify-center">
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
                    <button onClick={()=>{
                        if(email===""||password===""){
                            setPopup({ state : true , message : "Fill the entries properly" })
                        }else{
                            loginUser()
                        }
                    }} className="border-2 border-blue-500 text-white px-5 py-2 rounded-md bg-blue-500 text-[1.25rem] duration-300 hover:bg-blue-400 my-3">Login</button>
                </div>

            </div>

            {popup.state && <Popup popup={popup} setPopup={setPopup}/> }

        </div>
    )
}

export default Login;