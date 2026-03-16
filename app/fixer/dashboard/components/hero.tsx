import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"

export default function Hero(){
    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    return (
        <main className="p-6 text-gray-500 space-y-4">
            <h2 className={`ml-2 ${themeFont}`}>Hero Section</h2>
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                <TextInput inputFor="hero-greeting" text="Greeting Text" placeholder="..."/>
                <TextInput inputFor="hero-subtitle" text="Subtitle" placeholder="..."/>
                <TextAreaInput inputFor="hero-description" text="Description" placeholder="..."/>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput type="date" inputFor="hero-exp-start" text="Experience Start Date" placeholder="..."/>
                    <TextInput type="email" inputFor="hero-email" text="Contact Email" placeholder="..."/>
                    <TextInput inputFor="hero-image" text="Profile Image URL" placeholder="..."/>
                    <TextInput inputFor="hero-image-bg" text="Hero Image Background URL" placeholder="..."/>
                </div>
            </div>
        </main>
    )
}

