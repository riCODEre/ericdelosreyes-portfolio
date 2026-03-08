'use client';
import { useState } from "react";
import { Sun, Moon } from "lucide-react";
import Image from 'next/image'

export default function Home() {
  // all UseState
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

  // all Toggles
  const toggleTheme = () => {
    setThemeMode(prev => (prev == 'light' ? 'dark' : 'light'))
  }

  // others
  const themeClasses = themeMode === 'light' ? 'bg-white text-black' : 'bg-black text-white'
  const heroThemeClasses = themeMode === 'light' ? 'bg-linear-to-r from-white via-white/95 to-white/80 text-black' : 'bg-linear-to-r from-black via-black/95 to-black/80 text-white'
  function ThemeButton (){
    if (themeMode === 'light') {
      return (
        <Sun size={24}></Sun>
      )
    }
    else{
      return (
        <Moon size={24}></Moon>
      )
    }
    
  }

  return (
    <div className={`${themeClasses} min-h-screen`}>
      <header className=" border-b border-gray-500/30 backdrop-blur-md py-5 px-10 fixed top-0 right-0 left-0 z-50">
        <nav className="flex justify-between items-center ">
          <a type="" href="#" className="uppercase font-mono text-cyan-500 text-lg font-bold " 
          style={{ textShadow: "rgba(0, 234, 255, 0.8) 0px 0px 10px, rgba(0, 234, 255, 0.4) 0px 0px 30px, rgba(0, 234, 255, 0.2) 0px 0px 60px" }}>
            &lt;Eric Delos Reyes&gt;
          </a>
          <div className="flex justify-end items-center gap-10">
            <NavLink link="#About" number="01" text="About"></NavLink>
            <NavLink link="#About" number="02" text="Skills"></NavLink>
            <NavLink link="#About" number="03" text="Projects"></NavLink>
            <NavLink link="#About" number="03" text="Contact"></NavLink>
            <button className="cursor-pointer border hover:shadow-[0_0_20px_5px_rgba(59,130,246,0.5)] border-cyan-500 p-2" onClick={toggleTheme}>
              <ThemeButton/>
            </button>
          </div> 
        </nav>
      </header>
      <main className="">
        <section id="hero" className="relative min-h-screen">
          <div className="absolute inset-0 scanline pointer-events-none z-30"></div>
          <div className="absolute inset-0">
            <img src="/images/heroimage.jpg" alt="" className="z-10 w-full h-full object-cover" />
          </div>
          <div className={`pt-20 absolute z-20 ${heroThemeClasses} w-full h-full flex justify-between`}>
            <div className="w-1/2">
                dawd
            </div>
            <div className="w-1/2 flex justify-start mt-10">
              <div className="rounded-2xl w-fit h-fit text-cyan-500 shadow-[0_0_20px_5px_rgba(0,184,219,0.5)] bg-linear-to-br from-cyan-500/50 via-transparent to-transparent">
                <div className="relative">
                  <Image
                    src={'/images/profilepic.png'}
                    width={350}
                    height={350}
                    alt=""
                  />
                  <div className="absolute w-1/11 h-1/13 border-t border-l left-5 top-5 border-cyan-500"></div>
                  <div className="absolute w-1/11 h-1/13 border-t border-r right-5 top-5 border-cyan-500"></div>
                  <div className="absolute w-1/11 h-1/13 border-b border-l left-5 bottom-5 border-red-500"></div>
                  <div className="absolute w-1/11 h-1/13 border-b border-r right-5 bottom-5 border-red-500"></div>

                </div>
              </div>
            </div>
            
          </div>      
        </section>
        
      </main>
    </div>
    
  )
}


function NavLink({link, number, text}: {link:string, number:string, text:string}){
  
  return (
    <a href={link} className="space-x-3 hover:text-cyan-500">
      <span className="text-red-500">{number}.</span>
      <span>{text}</span>
    </a>
  )
}