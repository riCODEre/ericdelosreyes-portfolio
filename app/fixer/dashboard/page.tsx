"use client"

import { useState, } from "react"
import { useTheme } from "../../context"
import { Menu } from "./type"
import Link from "next/link"
import About from "./components/about"
import Certifications from "./components/certs"
import Contacts from "./components/contacts"
import Experience from "./components/exp"
import Hero from "./components/hero"
import Projects from "./components/projects"
import Recommendations from "./components/recs"
import Skills from "./components/skills"

import { Phone, Quote, Award, FolderOpen, Code, Briefcase, User, Home, Icon, SquareArrowRightExit, Save, RotateCcw, Moon, Sun } from "lucide-react"

export default function Dashboard(){

    const menu: Menu[] = [
        { name: "Hero", Icon: Home, Comp: Hero },
        { name: "About", Icon: User, Comp: About },
        { name: "Experience", Icon: Briefcase, Comp: Experience },
        { name: "Skills", Icon: Code, Comp: Skills },
        { name: "Projects", Icon: FolderOpen, Comp: Projects },
        { name: "Certifications", Icon: Award, Comp: Certifications },
        { name: "Recommendations", Icon: Quote, Comp: Recommendations },
        { name: "Contact", Icon: Phone, Comp: Contacts },
    ]

    const { themeMode, toggleTheme } = useTheme()
    const [ curMenu, setCurMenu] = useState<string>(menu[0].name)
    const [curComp, setCurComp] = useState<Menu>(menu[0])

    const bgTheme = themeMode === 'light' ? 'bg-white' : 'bg-[#080A0C]'
    const bgFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const bgFontHover = themeMode === 'light' ? 'hover:text-black' : 'hover:text-white'
    const bgThemeHover = themeMode === 'light' ? 'hover:bg-black/10' : 'hover:bg-white/10'

    

    function ThemeButton (){
        if (themeMode === 'light') {
        return (
            <Sun size={15}></Sun>
        )
        }
        else{
        return (
            <Moon size={15}></Moon>
        ) 
        }
    }

    return (
        <div className={`w-full min-h-screen flex ${bgTheme} ${bgFont}`}>
            {/* Will contain sidebar */}
            <aside className="w-1/5 border-r flex flex-col justify-between border-cyan-500/20 font-mono">
                <div>
                    <div className="border-b border-cyan-500/20 p-6  space-y-1">
                        <h2 className="text-xl font-bold "><span className="text-cyan-500">admin</span>.panel</h2>
                        <p className="text-gray-500 text-xs">Porfolio CMS</p>
                    </div>
                    <div className="p-6 space-y-1 text-sm">
                        {menu.map((item) => (
                            <button type="button" key={item.name} onClick={() => (setCurMenu(item.name), setCurComp(item))} className={`${curMenu === item.name ? 'bg-cyan-500/5 text-cyan-500 border border-cyan-500/20' : 'text-gray-500'} w-full px-4 py-2 rounded-lg flex items-center space-x-3 ${bgFontHover} ${bgThemeHover}`}>
                                <item.Icon className="w-4 h-4"/> 
                                <span>{item.name}</span>
                            </button>
                        ))}

                    </div>
                </div>
                <div className="w-full border-cyan-500/20 p-6 space-y-1 border-t text-gray-500 text-sm">
                    <Link href="/" className={`flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-white/10 hover:text-white/90 hover:${bgFont}`}>
                        <Home className="w-4 h-4"/>
                        <span>View Site</span>
                    </Link>
                    <Link href="" className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-red-500/90 hover:bg-white/10 hover:text-white/90 hover:${bgFont}`}>
                        <SquareArrowRightExit className="w-4 h-4"/>
                        <span>Logout</span>
                    </Link>
                </div>
            </aside>
            {/* Will contain dashboard content */}
            <div className="w-4/5 h-full">
                <nav className="text-sm text-bold h-1/9 w-full border-b border-cyan-500/20 p-5 flex items-center justify-between">
                    <button className="cursor-pointer border hover:shadow-[0_0_20px_5px_rgba(0,184,219,0.5)] border-cyan-500/40 p-2 transition-all duration-300" onClick={toggleTheme}>
                        <ThemeButton/>
                    </button>
                    <div className="flex items-center justify-end  space-x-4">
                        <button className="btn-primary px-5 py-2 rounded-lg text-black space-x-1 flex items-center justify-center">
                            <Save className="w-4 h-4"/>
                            <span className="">Save</span>
                            
                        </button>
                        <button className="btn-warning-outline px-5 py-2 rounded-lg text-red-500 space-x-1 flex items-center justify-center">
                            <RotateCcw className="w-4 h-4"/>
                            <span className="">Reset</span>
                            
                        </button>
                    </div>
                    
                </nav>
                <curComp.Comp/>

            </div>
        </div>
    )
}