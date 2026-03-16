import { Plus, Trash } from "lucide-react";
import { TextAreaInput, TextInput } from "./components";
import { useTheme } from "@/app/context"

export default function Experience(){

    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'

    return (
        <main className="p-6 text-gray-500 space-y-5 w-full">
            <div className="flex w-full justify-between items-center">
                <h2 className={`ml-2 ${themeFont}`}>Work Experience</h2>
                <button className="flex items-center space-x-1  btn-primary rounded-lg text-sm text-black px-5 py-2">
                    <Plus size={15} />
                    <span>Add</span>
                </button>
            </div>
            
            <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                <div className="grid grid-cols-2 gap-6">
                    <TextInput inputFor="exp-role" text="Position" placeholder="..."/>
                    <TextInput inputFor="exp-company" text="Company" placeholder="..."/>
                    <TextInput type="exp-date" inputFor="exp-date-range" text="Date Range" placeholder="..."/>
                    <TextInput inputFor="exp-tag" text="Tag" placeholder="..."/>
                </div>
                <TextInput inputFor="exp-logo-url" text="Logo URL" placeholder="..."/>

                <div className="space-y-1">
                    <h3 className="uppercase font-mono text-xs text-gray-400">Descriptions</h3>
                    <div className="flex justify-between space-x-2 items-center">
                        <TextInput inputFor="exp-desc1" text="" className="w-full" placeholder="..."/>
                        <Trash size={18} className="text-red-500 hover:text-red-700" />
                    </div>
                    <div className="flex justify-between space-x-2 items-center">
                        <TextInput inputFor="exp-desc1" text="" className="w-full" placeholder="..."/>
                        <Trash size={18} className="text-red-500 hover:text-red-700" />
                    </div>
                </div>
                <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700">
                    <Plus size={15} className=" " />
                    <span>Add Description</span>
                </button>
                <TextInput inputFor="exp-skills" text="Skills (comma separated)" placeholder="..."/>
            </div>
        </main>
    )
}