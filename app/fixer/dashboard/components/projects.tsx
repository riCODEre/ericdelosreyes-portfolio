"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState } from "react"
import type { Project } from "@/app/type"
import Nav from "./nav"

export default function Projects(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/projects/")
                setProjects(response.data)
            } catch (error) {
                console.error("Error fetching projects:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateProject = (index: number, patch: Partial<Project>) => {
        setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleAddProject = async () => {
        try {
            const payload = {
                title: "New Project",
                type: "Work",
                desc: "",
                link: "",
                skill: [""],
            }
            const response = await apiClient.post("/projects/", payload)
            setProjects((prev) => [...prev, response.data])
            setIsDirty(false)
        } catch (error) {
            console.error("Error creating project:", error)
        }
    }

    const handleSave = async () => {
        try {
            const updatedRows = await Promise.all(
                projects.map(async (project) => {
                    const payload = {
                        title: project.title,
                        type: project.type,
                        desc: project.desc,
                        link: project.link,
                        skill: project.skill,
                    }

                    try {
                        const updated = await apiClient.put(`/projects/${project.id}`, payload)
                        return updated.data as Project
                    } catch (error: any) {
                        if (error?.response?.status === 404) {
                            const created = await apiClient.post("/projects/", payload)
                            return created.data as Project
                        }
                        throw error
                    }
                })
            )

            setProjects(updatedRows)
            setIsDirty(false)
        } catch (error) {
            console.error("Error saving projects:", error)
        }
    }

    const handleDeleteProject = async (index: number) => {
        const target = projects[index]

        try {
            await apiClient.delete(`/projects/${target.id}`)
            setProjects((prev) => prev.filter((_, i) => i !== index))
            setIsDirty(true)
        } catch (error) {
            console.error("Error deleting project:", error)
        }
    }

    const handleAddSkill = (index: number) => {
        const current = projects[index]
        updateProject(index, { skill: [...current.skill, ""] })
    }

    const handleDeleteSkill = (index: number, skillIndex: number) => {
        const current = projects[index]
        updateProject(index, { skill: current.skill.filter((_, i) => i !== skillIndex) })
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading projects...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Projects</h2>
                    <button className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2" onClick={handleAddProject}>
                        <Plus size={15} />
                        <span>Add</span>
                    </button>
                </div>
                {projects.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No projects yet. Click Add to create one.
                    </div>
                )}
                {projects.map((project, key) => (
                    <div key={project.id ?? key} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between space-x-2 items-center">
                            <h3 className="text-sm text-cyan-500">#{key + 1}</h3>
                            <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteProject(key)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput inputFor={`proj-title-${key}`} text="Title" placeholder="..." value={project.title} onChange={(e) => updateProject(key, { title: e.target.value })}/>
                            <TextInput inputFor={`proj-type-${key}`} text="Type" placeholder="..." value={project.type} onChange={(e) => updateProject(key, { type: e.target.value })}/>
                        </div>
                        <TextAreaInput inputFor={`proj-desc-${key}`} text="Description" placeholder="..." value={project.desc} onChange={(e) => updateProject(key, { desc: e.target.value })}/>
                        <TextInput inputFor={`proj-link-${key}`} text="Link" placeholder="..." value={project.link} onChange={(e) => updateProject(key, { link: e.target.value })}/>
                        <div className="flex gap-4 flex-wrap">
                            {project.skill.map((skill, skillkey) => (
                                <div key={skillkey} className="flex items-center gap-2">
                                    <TextInput inputFor={`proj-skills-${key}-${skillkey}`} text="" className="w-fit" placeholder="..." value={skill} onChange={(e) => {
                                        const next = [...project.skill]
                                        next[skillkey] = e.target.value
                                        updateProject(key, { skill: next })
                                    }}/>
                                    <Trash size={16} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteSkill(key, skillkey)} />
                                </div>
                            ))}
                            <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700" onClick={() => handleAddSkill(key)}>
                                <Plus size={15} className=" " />
                                <span>Add Skill</span>
                            </button>
                        </div>

                    </div>
                ))}
                <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
            </main>
        </div>
    )
}