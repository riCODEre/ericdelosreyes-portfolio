import { TextInput, TextAreaInput } from "./components"
import { useTheme } from "@/app/context"

export default function About(){

    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'

    return (
        <main className=" p-6 text-gray-500 space-y-4">
            <h2 className={` ${themeFont} ml-2`}>About Section</h2>
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                
                <TextAreaInput inputFor="about-description" text="Description" placeholder="..."/>
                
            </div>
        </main>
    )
}