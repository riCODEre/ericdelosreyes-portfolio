"use client"

import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react";
import { TextInput } from "./components";
import { useTheme } from "@/app/context"
import { apiClient } from "@/app/services";
import { useEffect, useRef, useState } from "react";
import type { WorkExp } from "@/app/type";
import type { SaveStatus } from "../type";
import Nav from "./nav";
import ConfirmDialog from "./confirm-dialog";

type PendingDelete =
    | { type: "experience"; id: number }
    | { type: "description"; index: number; descIndex: number }
    | { type: "skill"; index: number; skillIndex: number }

export default function Experience(){

    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [experiences, setExperiences] = useState<WorkExp[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/exp/")
                setExperiences(response.data)
            } catch (error) {
                console.error("Error fetching experiences:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateExperience = (index: number, patch: Partial<WorkExp>) => {
        setExperiences((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleMoveExperience = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= experiences.length) return

        setExperiences((prev) => {
            const next = [...prev]
            ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
            return next
        })
        setIsDirty(true)
    }

    const handleAddExperience = async () => {
        if (isAdding) return
        setIsAdding(true)
        try {
            const payload = {
                tag: "new-work",
                link: "",
                position: "",
                date: "",
                company: "",
                desc: [""],
                skill: [""],
                sortOrder: experiences.length,
            }
            const response = await apiClient.post("/exp/", payload)
            setExperiences((prev) => [...prev, response.data])
        } catch (error) {
            console.error("Error creating experience:", error)
        } finally {
            setIsAdding(false)
        }
    }

    const validate = (): string | null => {
        const invalid = experiences.some((exp) => !exp.position.trim() || !exp.company.trim())
        if (invalid) return "Position and Company are required for every work experience entry."
        return null
    }

    const handleSave = async () => {
        const validationError = validate()
        if (validationError) {
            setSaveStatus("error")
            setErrorMessage(validationError)
            return
        }

        setSaveStatus("saving")
        try {
            const updates = await Promise.all(
                experiences.map(async (exp, index) => {
                    const payload = {
                        tag: exp.tag,
                        link: exp.link,
                        position: exp.position,
                        date: exp.date,
                        company: exp.company,
                        desc: exp.desc,
                        skill: exp.skill,
                        sortOrder: index,
                    }
                    const response = await apiClient.put(`/exp/${exp.id}`, payload)
                    return response.data as WorkExp
                })
            )

            setExperiences(updates)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving experiences:", error)
            setErrorMessage("Some experiences may not have been saved. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    const handleDeleteExperience = async (id: number) => {
        try {
            await apiClient.delete(`/exp/${id}`)
            setExperiences((prev) => prev.filter((item) => item.id !== id))
        } catch (error) {
            console.error("Error deleting experience:", error)
        }
    }

    const handleAddDescription = (index: number) => {
        const current = experiences[index]
        updateExperience(index, { desc: [...current.desc, ""] })
    }

    const handleDeleteDescription = (index: number, descIndex: number) => {
        const current = experiences[index]
        updateExperience(index, { desc: current.desc.filter((_, i) => i !== descIndex) })
    }

    const handleAddSkill = (index: number) => {
        const current = experiences[index]
        updateExperience(index, { skill: [...current.skill, ""] })
    }

    const handleDeleteSkill = (index: number, skillIndex: number) => {
        const current = experiences[index]
        updateExperience(index, { skill: current.skill.filter((_, i) => i !== skillIndex) })
    }

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

    const confirmDeleteTitle = pendingDelete?.type === "experience"
        ? "Delete Work Experience"
        : pendingDelete?.type === "description"
            ? "Delete Description"
            : "Delete Skill"

    const confirmDeleteMessage = pendingDelete?.type === "experience"
        ? "This will permanently delete this work experience entry and cannot be undone."
        : pendingDelete?.type === "description"
            ? "This will permanently delete this description line and cannot be undone."
            : "This will permanently delete this skill and cannot be undone."

    const handleConfirmDelete = () => {
        if (!pendingDelete) return
        if (pendingDelete.type === "experience") {
            handleDeleteExperience(pendingDelete.id)
        } else if (pendingDelete.type === "description") {
            handleDeleteDescription(pendingDelete.index, pendingDelete.descIndex)
        } else {
            handleDeleteSkill(pendingDelete.index, pendingDelete.skillIndex)
        }
        setPendingDelete(null)
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading work experience...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <ConfirmDialog
                open={pendingDelete !== null}
                title={confirmDeleteTitle}
                message={confirmDeleteMessage}
                onConfirm={handleConfirmDelete}
                onCancel={() => setPendingDelete(null)}
            />
            <main className="p-6 text-gray-500 space-y-5 w-full">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Work Experience</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAddExperience}
                        disabled={isAdding}
                    >
                        <Plus size={15} />
                        <span>{isAdding ? "Adding..." : "Add"}</span>
                    </button>
                </div>
                {experiences.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No work experience records yet. Click Add to create your first one.
                    </div>
                )}
                {experiences.map((exp, key) => (
                    <div key={exp.id} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-end gap-2 items-center">
                            <button
                                type="button"
                                className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                onClick={() => handleMoveExperience(key, "up")}
                                disabled={key === 0}
                                aria-label={`Move experience ${key + 1} up`}
                            >
                                <ArrowUp size={16} />
                            </button>
                            <button
                                type="button"
                                className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                onClick={() => handleMoveExperience(key, "down")}
                                disabled={key === experiences.length - 1}
                                aria-label={`Move experience ${key + 1} down`}
                            >
                                <ArrowDown size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <TextInput inputFor={`exp-role-${exp.id}`} text="Position" placeholder="..." value={exp.position} onChange={(e) => updateExperience(key, { position: e.target.value })}/>
                            <TextInput inputFor={`exp-company-${exp.id}`} text="Company" placeholder="..." value={exp.company} onChange={(e) => updateExperience(key, { company: e.target.value })}/>
                            <TextInput inputFor={`exp-date-range-${exp.id}`} text="Date Range" placeholder="..." value={exp.date} onChange={(e) => updateExperience(key, { date: e.target.value })}/>
                            <TextInput inputFor={`exp-tag-${exp.id}`} text="Tag" placeholder="..." value={exp.tag} onChange={(e) => updateExperience(key, { tag: e.target.value })}/>
                        </div>
                        <TextInput inputFor={`exp-logo-url-${exp.id}`} text="Logo URL" placeholder="..." value={exp.link} onChange={(e) => updateExperience(key, { link: e.target.value })}/>
                        <div className="space-y-1">
                            <h3 className="uppercase font-mono text-xs text-gray-400">Descriptions</h3>
                            {exp.desc.map((desc, desckey) => (
                            <div key={desckey} className="flex justify-between space-x-2 items-center">
                                <TextInput inputFor={`exp-desc-${exp.id}-${desckey}`} text="Description" className="w-full" placeholder="..." value={desc} onChange={(e) => {
                                    const nextDesc = [...exp.desc]
                                    nextDesc[desckey] = e.target.value
                                    updateExperience(key, { desc: nextDesc })
                                }}/>
                                <button
                                    type="button"
                                    aria-label={`Delete description ${desckey + 1}`}
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => setPendingDelete({ type: "description", index: key, descIndex: desckey })}
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                            ))}
                        </div>
                        <button type="button" className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700" onClick={() => handleAddDescription(key)}>
                            <Plus size={15} className=" " />
                            <span>Add Description</span>
                        </button>
                        <h3 className="uppercase font-mono text-xs text-gray-400">Skills</h3>
                        <div className="flex gap-4 flex-wrap">
                            {exp.skill.map((skill, skillkey) => (
                                <div key={skillkey} className="flex items-center gap-2">
                                    <TextInput inputFor={`exp-skills-${exp.id}-${skillkey}`} text="Skill" className="w-fit" placeholder="..." value={skill} onChange={(e) => {
                                        const nextSkill = [...exp.skill]
                                        nextSkill[skillkey] = e.target.value
                                        updateExperience(key, { skill: nextSkill })
                                    }}/>
                                    <button
                                        type="button"
                                        aria-label={`Delete skill ${skillkey + 1}`}
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setPendingDelete({ type: "skill", index: key, skillIndex: skillkey })}
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
                        <div className="flex justify-between items-center pt-2">
                            <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
                            <button
                                type="button"
                                aria-label={`Delete experience: ${exp.position || exp.company || "Untitled"}`}
                                className="btn-warning-outline px-4 py-2 rounded-lg text-red-500 text-xs"
                                onClick={() => setPendingDelete({ type: "experience", id: exp.id })}
                            >
                                Delete Experience
                            </button>
                        </div>
                        
                    </div>
                ))}
            </main>
        </div>
    )
}