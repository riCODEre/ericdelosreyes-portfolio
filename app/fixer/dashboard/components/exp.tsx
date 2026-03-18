import { Plus, Trash } from "lucide-react";
import { TextAreaInput, TextInput } from "./components";
import { useTheme } from "@/app/context"
import { allWorkExp } from "@/app/data";

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
            {allWorkExp.map((exp, key) => (
                <div key={key} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                        <TextInput inputFor="exp-role" text="Position" placeholder="..." value={exp.position}/>
                        <TextInput inputFor="exp-company" text="Company" placeholder="..." value={exp.company}/>
                        <TextInput type="exp-date" inputFor="exp-date-range" text="Date Range" placeholder="..." value={exp.date}/>
                        <TextInput inputFor="exp-tag" text="Tag" placeholder="..." value={exp.tag}/>
                    </div>
                    <TextInput inputFor="exp-logo-url" text="Logo URL" placeholder="..." value={exp.link}/>
                    <div className="space-y-1">
                        <h3 className="uppercase font-mono text-xs text-gray-400">Descriptions</h3>
                        {exp.desc.map((desc, desckey) => (
                        <div key={desckey} className="flex justify-between space-x-2 items-center">
                            <TextInput inputFor="exp-desc1" text="" className="w-full" placeholder="..." value={desc}/>
                            <Trash size={18} className="text-red-500 hover:text-red-700" />
                        </div>
                        ))}
                    </div>
                    <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700">
                        <Plus size={15} className=" " />
                        <span>Add Description</span>
                    </button>
                    <h3 className="uppercase font-mono text-xs text-gray-400">Skills</h3>
                    <div className="flex gap-4 flex-wrap">
                        {exp.skill.map((skill, skillkey) => (
                            <TextInput key={skillkey} inputFor="exp-skills" text="" className="w-fit" placeholder="..." value={skill}/>
                        ))}
                        <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700">
                            <Plus size={15} className=" " />
                            <span>Add Skill</span>
                        </button>
                    </div>
                    
                </div>
            ))}
        </main>
    )
}