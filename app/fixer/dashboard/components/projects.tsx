"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import type { Project } from "@/app/type"
import type { SaveStatus } from "../type"
import Nav from "./nav"
import ConfirmDialog from "./confirm-dialog"

export default function Projects(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isAddingProject, setIsAddingProject] = useState<boolean>(false)
    const [pendingDeleteProject, setPendingDeleteProject] = useState<number | null>(null)
    const [pendingDeleteSkill, setPendingDeleteSkill] = useState<{ index: number; skillIndex: number } | null>(null)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    useEffect(() => {
        function handleBeforeUnload(e: BeforeUnloadEvent) {
            if (!isDirty) return
            e.preventDefault()
            e.returnValue = ""
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isDirty])

    useEffect(() => {
        return () => {
            if (saveStatusTimeoutRef.current) clearTimeout(saveStatusTimeoutRef.current)
        }
    }, [])

    const updateProject = (index: number, patch: Partial<Project>) => {
        setProjects((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleMoveProject = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= projects.length) return

        setProjects((prev) => {
            const next = [...prev]
            ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
            return next
        })
        setIsDirty(true)
    }

    const handleAddProject = async () => {
        if (isAddingProject) return
        setIsAddingProject(true)
        try {
            const payload = {
                title: "New Project",
                type: "Work",
                desc: "",
                link: "",
                skill: [""],
                sortOrder: projects.length,
            }
            const response = await apiClient.post("/projects/", payload)
            setProjects((prev) => [...prev, response.data])
        } catch (error) {
            console.error("Error creating project:", error)
        } finally {
            setIsAddingProject(false)
        }
    }

    const validate = (): string | null => {
        for (let i = 0; i < projects.length; i++) {
            if (!projects[i].title.trim()) return `Project #${i + 1} is missing a title.`
        }
        return null
    }

    const handleSave = async () => {
        if (saveStatus === "saving") return

        const validationError = validate()
        if (validationError) {
            setSaveStatus("error")
            setErrorMessage(validationError)
            return
        }

        setSaveStatus("saving")
        try {
            const updatedRows = await Promise.all(
                projects.map(async (project, index) => {
                    const payload = {
                        title: project.title,
                        type: project.type,
                        desc: project.desc,
                        link: project.link,
                        skill: project.skill,
                        sortOrder: index,
                    }

                    try {
                        const updated = await apiClient.put(`/projects/${project.id}`, payload)
                        return updated.data as Project
                    } catch (error) {
                        if (axios.isAxiosError(error) && error.response?.status === 404) {
                            const created = await apiClient.post("/projects/", payload)
                            return created.data as Project
                        }
                        throw error
                    }
                })
            )

            setProjects(updatedRows)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving projects:", error)
            setErrorMessage("Error saving projects. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    const handleDeleteProject = async (index: number) => {
        const target = projects[index]

        try {
            await apiClient.delete(`/projects/${target.id}`)
            setProjects((prev) => prev.filter((_, i) => i !== index))
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
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Projects</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAddProject}
                        disabled={isAddingProject}
                    >
                        <Plus size={15} />
                        <span>{isAddingProject ? "Adding..." : "Add"}</span>
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
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveProject(key, "up")}
                                    disabled={key === 0}
                                    aria-label={`Move project ${key + 1} up`}
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveProject(key, "down")}
                                    disabled={key === projects.length - 1}
                                    aria-label={`Move project ${key + 1} down`}
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setPendingDeleteProject(key)}
                                    aria-label={`Delete project ${key + 1}`}
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
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
                                    <button
                                        type="button"
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                        onClick={() => setPendingDeleteSkill({ index: key, skillIndex: skillkey })}
                                        aria-label={`Delete skill ${skillkey + 1} from project ${key + 1}`}
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}
                            <button type="button" className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700" onClick={() => handleAddSkill(key)}>
                                <Plus size={15} className=" " />
                                <span>Add Skill</span>
                            </button>
                        </div>

                    </div>
                ))}
                <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
            </main>
            <ConfirmDialog
                open={pendingDeleteProject !== null}
                title="Delete Project"
                message="This will permanently delete this project and cannot be undone."
                onConfirm={() => {
                    if (pendingDeleteProject !== null) handleDeleteProject(pendingDeleteProject)
                    setPendingDeleteProject(null)
                }}
                onCancel={() => setPendingDeleteProject(null)}
            />
            <ConfirmDialog
                open={pendingDeleteSkill !== null}
                title="Delete Skill"
                message="This will remove this skill from the project. The change is saved once you click Save."
                onConfirm={() => {
                    if (pendingDeleteSkill) handleDeleteSkill(pendingDeleteSkill.index, pendingDeleteSkill.skillIndex)
                    setPendingDeleteSkill(null)
                }}
                onCancel={() => setPendingDeleteSkill(null)}
            />
        </div>
    )
}