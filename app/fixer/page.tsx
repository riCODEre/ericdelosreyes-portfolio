"use client"

import { log } from "console"
import { useTheme } from "../context"
import { ArrowBigLeft, ArrowLeft, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Fixer(){

    const { themeMode, toggleTheme } = useTheme()

    const [loginEmail, setLoginEmail] = useState<string>("")
    const [loginPass, setLoginPass] = useState<string>("")

    const bgTheme = themeMode === 'light' ? 'bg-white' : 'bg-[#080A0C]'
    const bgFont = themeMode === 'light' ? 'text-black' : 'text-white'

    return (
        <main className={`w-full h-screen flex flex-col justify-center items-center ${bgTheme} ${bgFont} space-y-8`}>
            <div className="space-y-2 flex flex-col justify-center items-center">
                <div className="border border-cyan-400/40 w-fit bg-cyan-500/10 p-6 rounded-xl cursor-pointer" onClick={toggleTheme}>
                    <Lock className="w-7 h-7 text-cyan-500"/>
                </div>
                <h2 className="font-mono lowercase text-3xl font-bold mt-2"><span className="text-cyan-500">Admin</span>.Login()</h2>
                <p className="text-gray-500 text-sm">Portfolio Management System</p>
            </div>
            <div className="px-8 py-9 border border-cyan-400/40 bg-cyan-500/10 rounded-xl w-1/4 space-y-5">
                <div className="space-y-1">
                    <p className="pl-1">Email</p>
                    <label htmlFor="loginEmail" className={`input ${bgTheme} ${bgFont} border border-gray-500/40 py-6 px-4!`}>
                        <div className="mr-2">
                            <Mail className="w-4 h-4 text-gray-500"/>
                        </div>
                        
                        <input id="loginEmail" type="email" placeholder="admin@eric.dev" className="py-10!" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                    </label>

                </div>
                <div className="space-y-1 w-full">
                    <p className="pl-1">Password</p>
                    <label htmlFor="loginPass" className={`input ${bgTheme} ${bgFont} border border-gray-500/40 py-6 px-4!`}>
                        <div className="mr-2">
                            <Lock className="w-4 h-4 text-gray-500"/>
                        </div>
                        
                        <input id="loginPass" type="password" placeholder="••••••••" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="py-10!"/>
                    </label>
                </div>
                <Link href="/fixer/dashboard">
                    <button className="btn-primary py-3 rounded-xl w-full text-black/70 uppercase font-mono font-bold">authenticate()</button>
                </Link>
                
            </div>
            
            <Link href="/" className="text-cyan-500 hover:underline">
                <ArrowLeft className="w-4 h-4 inline-block mr-1"/>
                <span>back to portfolio</span>
            </Link>
        </main>

    )
}