import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { Plus, Trash } from "lucide-react"

export default function Contacts(){
    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    return (
        <main className="p-6 text-gray-500 space-y-4">
            <div className="flex w-full justify-between items-center">
                <h2 className={`ml-2 ${themeFont}`}>Contacts</h2>
                <button className="flex items-center space-x-1  btn-primary rounded-lg text-sm text-black px-5 py-2">
                    <Plus size={15} />
                    <span>Add</span>
                </button>
            </div>
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                <TextAreaInput inputFor="contact-desc" text="Description" placeholder="..."/>
                <div className="grid grid-cols-2 gap-4">
                    <TextInput inputFor="contact-email" text="Email" type="email" placeholder="..."/>
                    <TextInput inputFor="contact-gh" text="GitHub" placeholder="..."/>
                    <TextInput inputFor="contact-linkedin" text="LinkedIn" placeholder="..."/>
                    <TextInput inputFor="contact-fb" text="Facebook" placeholder="..."/>
                </div>
                
                

            </div>
        </main>
    )
}