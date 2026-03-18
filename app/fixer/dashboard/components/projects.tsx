import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { allProjects } from "@/app/data"

export default function Projects(){
    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    return (
        <main className="p-6 text-gray-500 space-y-4">
            <div className="flex w-full justify-between items-center">
                <h2 className={`ml-2 ${themeFont}`}>Projects</h2>
                <button className="flex items-center space-x-1  btn-primary rounded-lg text-sm text-black px-5 py-2">
                    <Plus size={15} />
                    <span>Add</span>
                </button>
            </div>
            {allProjects.map((project, key) => (
                <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                    <div className="flex justify-between space-x-2 items-center">
                        <h3 className="text-sm text-cyan-500">#{key + 1}</h3>
                        <Trash size={18} className="text-red-500 hover:text-red-700" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput inputFor="proj-title" text="Title" placeholder="..." value={project.title}/>
                        <TextInput inputFor="proj-type" text="Type" placeholder="..." value={project.type}/>
                    </div>
                    <TextAreaInput inputFor="proj-desc" text="Description" placeholder="..." value={project.desc}/>
                    <TextInput inputFor="proj-link" text="Link" placeholder="..." value={project.link}/>
                    <div className="flex gap-4 flex-wrap">
                        {project.skill.map((skill, skillkey) => (
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