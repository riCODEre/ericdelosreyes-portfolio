'use client';
import { useState, useEffect } from "react";
import { Sun, Moon, Gpu, Cpu, Github, ExternalLink, Medal, Badge, FileCheck, Award, Quote, Linkedin, Twitter, Mail, Facebook, Menu } from "lucide-react";
import Image from 'next/image'
import { allWorkExp, allSkill, allProjects, allCert, allReco, allNav } from "./data"
import { Cert, Project, WorkExp } from './type'


export default function Home() {
  // all normal vars
  const greet:string = "hi, Eric here"
  
  // all UseState
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light')

  const [expID, setExpID] = useState<number>()

  const [expPosition, setExpPosition] = useState<string>('')
  const [expDate, setExpDate] = useState<string>('')
  const [expCompany,setExpCompany ] = useState<string>('')
  const [expDesc,setExpDesc ] = useState<string[]>([])
  const [expSkill, setExpSkill ] = useState<string[]>([])
  const [greeting, setGreeting] = useState<string>('')
  const [curWork, setCurWork] = useState<WorkExp>(allWorkExp[1])
  
  const [menuState, setMenuState] = useState<boolean>(true)
  
  // all Toggles
  const toggleTheme = () => {
    setThemeMode(prev => (prev == 'light' ? 'dark' : 'light'))
  }
  const switchWork = (work:string) => {
    for (let workExp of allWorkExp){
      if (work === workExp.tag){
        setCurWork(workExp)
      }
      
    }  
  }

  // all use Effect
  useEffect(() => {
    for (let i = 0; i < greet.length; i++) {
      setTimeout(() => {
        setGreeting(prev => prev + greet[i]);
      }, i * 110);
    }
  }, []);
  useEffect(() => {
    setExpID(curWork.id)
    setExpPosition(curWork.position)
    setExpDate(curWork.date)
    setExpCompany(curWork.company)
    setExpDesc(curWork.desc)
    setExpSkill(curWork.skill)
  }, [switchWork])

  // others
  const themeFont:string = themeMode === 'light' ? 'text-black' : 'text-white/80'
  const themeFontRev:string = themeMode === 'light' ? 'text-white/80' : 'text-black'
  const themeBG:string = themeMode === 'light' ? 'bg-white' : 'bg-[#080A0C]'
  const heroThemeClasses:string = themeMode === 'light' ? 'bg-linear-to-r from-white via-white/95 to-white/80' : 'bg-linear-to-r from-black via-black/95 to-black/80'
  const themeBGColor:string = themeMode === 'light' ? 'white' : 'black'
  const navThemeBG:string = themeMode === 'light' ? 'bg-white/80' : 'bg-black/80'

  // functions
  function ThemeButton (){
    if (themeMode === 'light') {
      return (
        <Sun size={18}></Sun>
      )
    }
    else{
      return (
        <Moon size={18}></Moon>
      ) 
    }
  }



  return (
    <div className="text-gray-500 min-h-screen">
      <header className={` border-b border-gray-500/30 ${navThemeBG} backdrop-blur-sm min-w-screen font-mono text-sm py-4 px-5 lg:px-20 fixed top-0 right-0 left-0 z-50`}>
        <nav className="flex justify-between items-center">
          <a type="" href="#" className={`uppercase ${themeFont} text-lg font-bold  [word-spacing:-0.4em]`} >
            Eric Delos Reyes
          </a>
          <div className="hidden lg:flex justify-end items-center gap-10 ">
            {allNav.map((nav, index) => (
              <a key={index} href={nav.link} className="space-x-2 hover:text-cyan-500">
                {nav.name}
              </a>
            ))}
            
            <button className="cursor-pointer border hover:shadow-[0_0_20px_5px_rgba(0,184,219,0.5)] border-cyan-500/40 p-2 transition-all duration-300" onClick={toggleTheme}>
              <ThemeButton/>
            </button>
          </div>
          <div className="flex flex-col lg:hidden relative">
            <button className="p-1 btn-primary-outline border-cyan-500/40! bg-glow-cyan ">
              <Menu onClick={() => (setMenuState(prev => !prev))}/>
            </button>
            <div className="absolute top-12.5 -right-10" hidden={menuState}>
              <ul className="menu bg-base-200 rounded-b-xl w-56 border-x border-b border-gray-500/30">
                {allNav.map((nav, index) => (
                  <li key={index}>
                    <a href={nav.link} className="space-x-2 hover:text-cyan-500">
                      {nav.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </nav>
      </header>
      <main className="relative">
        <div className="absolute inset-0 scanline pointer-events-none z-30"></div>
        {/* For hero section */}
        <section id="hero" className="relative min-h-screen">
          <div className="absolute inset-0">
            <img src="/images/heroimage.jpg" alt="" className="z-10 w-full h-full object-cover" />
          </div>
          <div className={` absolute z-20 ${heroThemeClasses} w-full h-full flex justify-between`}>
          <div className="absolute w-1/15 h-1/8 border-b border-l left-5 bottom-5 border-cyan-500/30 pointer-events-none"></div>
          <div className="absolute w-1/15 h-1/8 border-t border-r right-5 top-20 border-rose-400/30 pointer-events-none"></div>
          <div className="flex w-full justify-center items-center">
            {/* profile */}
            <div className="hidden lg:block">
              <div className="rounded-2xl w-fit h-fit text-cyan-500  bg-linear-to-br from-cyan-500/50 via-transparent to-pink-500/50">
                <div className="relative overflow-hidden">
                  <Image
                    src={'/images/profilepic.png'}
                    width={370}
                    height={370}
                    alt=""
                    className="hover:scale-110 object-cover transition-all duration-550"
                  />
                  <div className={`absolute rounded-2xl inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-${themeBGColor} via-${themeBGColor}/60 to-transparent pointer-events-none`}></div>
                  <div className="absolute w-1/17 h-1/20 border-t border-l left-5 top-5 border-cyan-500/40 pointer-events-none"></div>
                  <div className="absolute w-1/17 h-1/20 border-t border-r right-5 top-5 border-cyan-500/40 pointer-events-none"></div>
                  <div className="absolute w-1/17 h-1/20 border-b border-l left-5 bottom-5 border-rose-500/40 pointer-events-none"></div>
                  <div className="absolute w-1/17 h-1/20 border-b border-r right-5 bottom-5 border-rose-500/40 pointer-events-none"></div>
                  
                </div>
                
              </div>
            </div>
            {/* Intro */}
            <div className="lg:w-1/2 flex flex-col justify-center pt-20 lg:pt-0 items-start px-5 lg:pl-20 space-y-2 lg:space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="border-b border-cyan-500 w-3 lg:w-15"></div>
                  <h5 className="text-[.6rem] lg:text-sm text-cyan-500 flex justify-start items-center space-x-2">
                    <span className="text-rose-400">npm</span> 
                    <span className={`${themeFont}`}>i</span> 
                    <span>software-engineer</span>
                    <span className="text-gray-500">--full-stack</span>
                    
                    </h5>
                </div>
                <div className="flex flex-col space-x-0 leading-20">
                  
                  <h1 className={`${themeFont} font-extrabold text-4xl lg:text-[5rem] transition-all duration-300 [word-spacing:-0.4em]`}>{greeting}
                    <span className="animate-ping duration-2000 text-cyan-500">|</span>
                  </h1>
                  
                </div>
                <p className="text-sm lg:text-lg break-normal lg:pr-30">
                  I'm a software engineer and gamer in Taguig City. I have the tendency to create extraordinary stuff (others call it overengineering)
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className={`btn-primary px-9 py-2 uppercase ${themeFontRev} transition-all duration-300`}>
                    View_Projects
                  </button>
                  <button className="btn-secondary-outline px-9 py-2 uppercase text-rose-400">
                    Contact_Me
                  </button>
                </div>
                <div className="flex justify-start items-end space-x-6 mt-4">
                  <div className="flex flex-col justify-center items-center space-y-1">
                    <h4 className="text-cyan-500 text-glow-cyan text-4xl font-semibold">4+</h4>
                    <p className="uppercase text-sm">Years exp</p>
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-1">
                    <h4 className="text-cyan-500 text-glow-cyan text-4xl font-semibold">4+</h4>
                    <p className="uppercase text-sm">Projects</p>
                  </div>
                  <div className="flex flex-col justify-center items-center space-y-1">
                    <h4 className="text-cyan-500 text-glow-cyan text-2xl font-semibold">
                      <i className="fa fa-infinity"></i>
                    </h4>
                    
                    <p className="uppercase text-sm">Curiosity</p>
                  </div>
                </div>
            </div>
          </div>
            
            
          </div>      
        </section>
        {/* For About Me */}
        <section id="about" className={`relative min-h-screen flex flex-col lg:flex-row gap-5 justify-center items-center px-5 lg:pt-0 pt-10 lg:px-20 ${themeBG} `}>
          <div className="lg:w-1/2 space-y-6">
            <div className="flex justify-start items-center space-x-3">
              <div className="border-b border-rose-400 w-8"></div>
              <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
                <span className="text-rose-400 text-glow-rose ">01.</span>
                <span className={`${themeFont}`}>About_Me</span>
              </h2>
            </div>
            <p className={`text-sm lg:text-xl ${themeFont} leading-loose pr-10`}>
                I’m a systems-oriented software engineer who enjoys breaking problems 
                down to their fundamentals and rebuilding them into better solutions. 
                I tend to question why a system exists before building it, which leads 
                me to design architectures focused on maintainability, performance, and 
                long-term scalability. Recently, I’ve been exploring AI-driven applications 
                and how intelligent systems can support better decision-making.
  
                <br/><br/>Outside of coding, I enjoy bending the rules of the games I play, 
                the food I cook, and sometimes, just a normal person binging K-Drama and Anime.
              </p>
          </div>
          <div className="px-10 lg:w-1/2 space-y-4 h-full">
            <img src="/images/lucyhack.gif" alt="" className="rounded-2xl w-full h-1/2 object-cover" />
            <div className="flex flex-wrap gap-4 h-full w-fit">
              <img src="/images/ryze.gif" alt="" className="flex-1 rounded-2xl w-1/2 object-cover" />
              <img src="/images/soracooking.gif" alt="" className="flex-1 rounded-2xl w-1/2 object-cover" />
            </div>
          </div>
        </section>
        {/* For experience */}
        <section id="experience" className={`relative min-h-screen flex flex-col justify-center items-start px-5 lg:px-20 ${themeBG} lg:pt-0 pt-10 space-y-5`}>
          <div className="flex justify-start items-center space-x-3">
            <div className="border-b border-cyan-500 w-8"></div>
            <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
              <span className="text-cyan-500 text-glow-cyan ">02.</span>
              <span className={`${themeFont}`}>Experience</span>
            </h2>
          </div>
          <div className="flex lg:flex-row flex-col justify-between items-start w-full lg:h-130 gap-10">
            <div className="flex lg:flex-row flex-col justify-center items-center p-10 gap-10 w-full lg:w-3/5 bg-linear-to-br h-fit lg:h-full from-cyan-500/50 via-transparent to-pink-500/50 rounded-2xl">
                {allWorkExp.map((work, index) => (
                  <div key={index} className="">
                    <img  src={`${work.link}`} alt="" onClick={() => (switchWork(work.tag))} className="hover:scale-105 active:scale-100 transition-all duration-100 ring-2 ring-cyan-500 rounded-full lg:h-40 lg:w-40 h-20 w-20 cursor-pointer shadow-2xl" />
                  </div>
                ))}
            </div>
            <div className={`relative flex items-start lg:w-2/5 `}>
              <div className=" ">
                <div className="space-y-3"> 
                  <div className="flex justify-between">
                    <h3 className={`${themeFont} font-semibold text-xl`}>{expPosition}</h3>
                    <p className="text-cyan-500">{expDate}</p>
                  </div>
                  <h3 className="text-rose-500">{expCompany}</h3>
                  <ul className="list-none space-y-2">
                    {expDesc.map((desc, index) => (
                      <li key={index} className="flex items-start">
                        <span>
                          <Gpu className="w-5 h-5 text-rose-400 mt-1 mr-4" />
                        </span>
                        <span>
                          {desc}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-4 text-center ">
                    {expSkill.map((skill, index) => (
                      <p key={index} className={`w-fit py-0.5 px-3 text-sm border rounded-tl-sm rounded-br-sm 
                          even:text-cyan-600 even:border-cyan-400 even:bg-cyan-500/20
                          odd:text-rose-600 odd:border-rose-400  odd:bg-rose-500/20
                          `}>
                        {skill}
                        </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* For skills */}
        <section id="skills" className={`pb-20 relative min-h-screen flex flex-col justify-center space-y-7 items-start px-5 lg:px-20 ${themeBG} lg:pt-0 pt-10`}>
          <div className="flex justify-start items-center space-x-3">
            <div className="border-b border-rose-400 w-8"></div>
            <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
              <span className="text-rose-400 text-glow-rose ">3.</span>
              <span className={`${themeFont}`}>Skills</span>
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] w-full gap-4">
            {allSkill.map((allSkill, index) => (
              <div key={index} className="flex-1 border border-cyan-400/40 bg-glow-cyan p-10 bg-cyan-100/5 space-y-3">
                <h3 className="uppercase text-rose-500 font-bold">// {allSkill.title}</h3>
                <ul key={index} className="space-y-4">
                  {allSkill.skillSet.map((name, index) => (
                    <li key={index} className="flex items-start group">
                      <span>
                        <Cpu className="w-5 h-5 text-cyan-400 group-hover:text-rose-500 mt-1 mr-4" />
                      </span>
                      <span className={`${themeFont}`}>
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
          </div>
        </section>
        {/* For projects */}
        <section id="projects" className={`relative min-h-screen flex flex-col justify-center items-start pb-5 px-5 lg:px-20 ${themeBG} lg:pt-0 pt-10`}>
          <div className="flex justify-start items-center space-x-3">
            <div className="border-b border-cyan-400 w-8"></div>
            <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
              <span className="text-cyan-400 text-glow-cyan ">04.</span>
              <span className={`${themeFont}`}>Projects</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2  w-full mt-4 gap-4">
            {allProjects.map((project, index) => (
              <div key={index} className="p-8 w-full space-y-4 border border-cyan-400/40 bg-glow-cyan bg-cyan-100/5">
                <div className="flex justify-between">
                  <h4 className="text-xl text-cyan-400 font-bold space-x-3">
                    <span>{project.title}</span> 
                    <span className="inline-block text-sm rounded-tl-xl rounded-br-xl text-rose-500 px-2 py-0.5 border border-rose-500/30 animate-pulse ">{project.type}</span>
                  </h4>
                  <a href={project.link} target="_blank">
                    <ExternalLink/>
                  </a>
                </div>
                <p>{project.desc}</p>
                <div className="flex flex-wrap gap-4">
                  {project.skill.map((skill, index) => (
                    <p key={index} className="w-fit py-0.5 px-3 text-sm border rounded-tl-sm rounded-br-sm 
                          text-cyan-600 border-cyan-400 bg-cyan-500/5">
                    {skill}
                  </p>
                  ))}
                  
                </div>
              </div>
            ))}
            
            
          </div>
        </section>
        {/* For Certification */}
        <section id="certifications" className={`relative flex flex-col py-20 justify-center items-start px-5 lg:px-20 ${themeBG} lg:pt-0 pt-10`}>
          <div className="flex justify-start items-center space-x-3">
            <div className="border-b border-rose-400 w-8"></div>
            <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
              <span className="text-rose-400 text-glow-rose ">05.</span>
              <span className={`${themeFont}`}>Certifications</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full mt-10 gap-4">
            {allCert.map((cert, index) => (
              <div key={index} className="p-5 w-full space-y-1 border bg-glow-cyan border-cyan-400/40 bg-cyan-100/5">
                <Award size={30} className="text-rose-500"/>
                <h4 className={`text-lg ${themeFont} font-bold`}>{cert.title}</h4>
                <div className="text-sm">
                  <p>{cert.issuer}</p>
                  <p className="text-cyan-400">{cert.year}</p>
                </div>
                <a href={cert.link} target="_blank" className="flex text-rose-500 items-center space-x-2">
                  <span>View Credential</span>
                  <ExternalLink size={15}/>
                </a>
              </div>
            ))}
            
            
          </div>
        </section>
        {/* For Recommendation */}
        <section id="recommendations" className={`relative py-40 flex flex-col justify-center items-start px-5 lg:px-20 ${themeBG} lg:pt-0 pt-10`}>
          <div className="flex justify-start items-center space-x-3">
            <div className="border-b border-cyan-400 w-8"></div>
            <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
              <span className="text-cyan-400 text-glow-cyan ">6.</span>
              <span className={`${themeFont}`}>Recommendations</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 w-full mt-10 gap-4">
            {allReco.map((recommendation, index) => (
              <div key={index} className="p-5 bg-glow-cyan w-full space-y-4 border border-cyan-400/40 bg-cyan-100/5">
                <Quote size={25} className="text-cyan-500/40"/>
                <p className="italic">"{recommendation.remark}"</p>
                <div className="border-b border-cyan-500/10"></div>
                <div>
                  <h5 className={themeFont}>{recommendation.name}</h5>
                  <p className="text-cyan-400 text-sm">{recommendation.positionCompany}</p>
                </div>
                
              </div>
            ))}
            
            
          </div>
        </section>
        <section id="contacts" className={`relative lg:py-20  flex flex-col justify-center items-start px-5 lg:px-20 bg-black/90 py-10`}>
          <div className="flex flex-col w-full justify-center items-center space-y-10">
            <div className="flex justify-center items-center space-x-4">
              <div className="border-b border-cyan-400 w-8"></div>
              <h2 className="text-xl lg:text-4xl font-bold space-x-5 font-mono">
                <span className="text-cyan-400 text-glow-cyan ">7.</span>
                <span className={`text-white`}>Contact</span>
              </h2>
              <div className="border-b border-cyan-400 w-8"></div>
            </div>
            <p className="lg:w-1/2 text-center">Ready to connect? Whether it's a project, collaboration, or just a conversation about tech — my inbox is always open.</p>
            <button className={`uppercase btn-primary ${themeFontRev} font-mono text-lg px-10 py-4 flex bg-glow-cyan`}>
              Send_Message&#40;&#41;
            </button>
            <div className="flex justify-center items-center space-x-5 text-white/90">
              <a href="https://github.com/riCODEre" target="_blank" className="border border-cyan-500/50 p-3 cursor-pointer">
                <Github />
              </a>
              <a href="https://www.linkedin.com/in/ericcode" target="_blank" className="border border-cyan-500/50 p-3 cursor-pointer">
                <Linkedin />
              </a>
              <a href="https://www.facebook.com/ricodere.711" target="_blank" className="border border-cyan-500/50 p-3 cursor-pointer">
                <Facebook />
              </a>
              <a href="https://mail.google.com/mail/?view=cm&to=thericodere@gmail.com" target="_blank" className="border border-cyan-500/50 p-3 cursor-pointer">
                <Mail />
              </a>
            </div>
          </div>
          
        </section>
      </main>
      <footer className="bg-black/95 border-t text-xs lg:text-base border-gray-700/80 py-5 w-full flex justify-center items-center">
        <p>© 2026 Eric Delos Reyes. All rights reserved.</p>
      </footer>
    </div>
    
  )
}