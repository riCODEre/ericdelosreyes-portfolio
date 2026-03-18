import { useState, } from "react"
import { useTheme } from "@/app/context"
import { Save, RotateCcw, Moon, Sun } from "lucide-react"
import { NavProps } from "../type"

export default function Nav({ onClickSave}: NavProps){
    
    const { themeMode, toggleTheme } = useTheme()

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
        <nav className="text-sm text-bold h-1/9 w-full border-b border-cyan-500/20 p-5 flex items-center justify-between">
            <button className="cursor-pointer border hover:shadow-[0_0_20px_5px_rgba(0,184,219,0.5)] border-cyan-500/40 p-2 transition-all duration-300" onClick={toggleTheme}>
                <ThemeButton/>
            </button>
            <div className="flex items-center justify-end  space-x-4">
                <button onClick={onClickSave} className="btn-primary px-5 py-2 rounded-lg text-black space-x-1 flex items-center justify-center">
                    <Save className="w-4 h-4"/>
                    <span className="">Save</span>
                    
                </button>
            </div>
            
        </nav>
    )
}
