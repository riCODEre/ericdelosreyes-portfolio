"use client"

import { useTheme } from "@/app/context"
import { TextInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useRef, useState } from "react"
import type { Skill } from "@/app/type"
import type { SaveStatus } from "../type"
import Nav from "./nav"
import ConfirmDialog from "./confirm-dialog"

type PendingDelete =
    | { type: "skillset"; index: number }
    | { type: "skill"; index: number; skillIndex: number }

export default function Skills(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [skillsets, setSkillsets] = useState<Skill[]>([])
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
                const response = await apiClient.get("/skills/")
                setSkillsets(response.data)
            } catch (error) {
                console.error("Error fetching skillsets:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateSkillset = (index: number, patch: Partial<Skill>) => {
        setSkillsets((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleAddSkillset = async () => {
        if (isAdding) return
        setIsAdding(true)
        try {
            const response = await apiClient.post("/skills/", {
                title: "New Skillset",
                skillSet: [""],
            })
            setSkillsets((prev) => [...prev, response.data])
        } catch (error) {
            console.error("Error creating skillset:", error)
        } finally {
            setIsAdding(false)
        }
    }

    const validate = (): string | null => {
        const invalid = skillsets.some((skillset) => !skillset.title.trim())
        if (invalid) return "Skillset title is required for every skillset."
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
            const updatedRows = await Promise.all(
                skillsets.map(async (skillset: Skill & { id?: number }) => {
                    if (!skillset.id) {
                        const created = await apiClient.post("/skills/", {
                            title: skillset.title,
                            skillSet: skillset.skillSet,
                        })
                        return created.data
                    }

                    const updated = await apiClient.put(`/skills/${skillset.id}`, {
                        title: skillset.title,
                        skillSet: skillset.skillSet,
                    })
                    return updated.data
                })
            )

            setSkillsets(updatedRows)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving skillsets:", error)
            setErrorMessage("Some skillsets may not have been saved. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    const handleDeleteSkillset = async (index: number) => {
        const target = skillsets[index] as Skill & { id?: number }

        try {
            if (target.id) {
                await apiClient.delete(`/skills/${target.id}`)
            }

            setSkillsets((prev) => prev.filter((_, i) => i !== index))
        } catch (error) {
            console.error("Error deleting skillset:", error)
        }
    }

    const handleAddSkill = (index: number) => {
        const current = skillsets[index]
        updateSkillset(index, { skillSet: [...current.skillSet, ""] })
    }

    const handleDeleteSkill = (index: number, skillIndex: number) => {
        const current = skillsets[index]
        updateSkillset(index, {
            skillSet: current.skillSet.filter((_, i) => i !== skillIndex),
        })
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

    const confirmDeleteTitle = pendingDelete?.type === "skillset" ? "Delete Skillset" : "Delete Skill"

    const confirmDeleteMessage = pendingDelete?.type === "skillset"
        ? "This will permanently delete this skillset and all of its skills, and cannot be undone."
        : "This will permanently delete this skill and cannot be undone."

    const handleConfirmDelete = () => {
        if (!pendingDelete) return
        if (pendingDelete.type === "skillset") {
            handleDeleteSkillset(pendingDelete.index)
        } else {
            handleDeleteSkill(pendingDelete.index, pendingDelete.skillIndex)
        }
        setPendingDelete(null)
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading skills...</main>
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
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Skills</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAddSkillset}
                        disabled={isAdding}
                    >
                        <Plus size={15} />
                        <span>{isAdding ? "Adding..." : "Add"}</span>
                    </button>
                </div>
                {skillsets.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No skillsets found yet. Click Add to create one.
                    </div>
                )}
                {skillsets.map((skillset, key) => (
                    <div key={key} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between space-x-2 items-center">
                            <TextInput
                                inputFor={`skills-title-${key}`}
                                text="Skill Title"
                                className="w-1/2"
                                placeholder="..."
                                value={skillset.title}
                                onChange={(e) => updateSkillset(key, { title: e.target.value })}
                            />
                            <button
                                type="button"
                                aria-label={`Delete skillset: ${skillset.title || "Untitled"}`}
                                className="text-red-500 hover:text-red-700"
                                onClick={() => setPendingDelete({ type: "skillset", index: key })}
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {skillset.skillSet.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex items-center gap-2">
                                    <TextInput
                                        inputFor={`skills-item-${key}-${skillIndex}`}
                                        text="Skill"
                                        className="w-fit"
                                        placeholder="..."
                                        value={skill}
                                        onChange={(e) => {
                                            const next = [...skillset.skillSet]
                                            next[skillIndex] = e.target.value
                                            updateSkillset(key, { skillSet: next })
                                        }}
                                    />
                                    <button
                                        type="button"
                                        aria-label={`Delete skill ${skillIndex + 1}`}
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => setPendingDelete({ type: "skill", index: key, skillIndex })}
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
        </div>
    )
}