"use client"

import { useTheme } from "@/app/context"
import { TextInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState } from "react"
import type { Skill } from "@/app/type"
import Nav from "./nav"

export default function Skills(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [skillsets, setSkillsets] = useState<Skill[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)

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
        try {
            const response = await apiClient.post("/skills/", {
                title: "New Skillset",
                skillSet: [""],
            })
            setSkillsets((prev) => [...prev, response.data])
            setIsDirty(false)
        } catch (error) {
            console.error("Error creating skillset:", error)
        }
    }

    const handleSave = async () => {
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
        } catch (error) {
            console.error("Error saving skillsets:", error)
        }
    }

    const handleDeleteSkillset = async (index: number) => {
        const target = skillsets[index] as Skill & { id?: number }

        try {
            if (target.id) {
                await apiClient.delete(`/skills/${target.id}`)
            }

            setSkillsets((prev) => prev.filter((_, i) => i !== index))
            setIsDirty(true)
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

    if (loading) {
        return <main className="p-6 text-gray-500">Loading skills...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Skills</h2>
                    <button
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2"
                        onClick={handleAddSkillset}
                    >
                        <Plus size={15} />
                        <span>Add</span>
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
                            <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteSkillset(key)} />
                        </div>
                        <div className="flex gap-4 flex-wrap">
                            {skillset.skillSet.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex items-center gap-2">
                                    <TextInput
                                        inputFor={`skills-item-${key}-${skillIndex}`}
                                        text=""
                                        className="w-fit"
                                        placeholder="..."
                                        value={skill}
                                        onChange={(e) => {
                                            const next = [...skillset.skillSet]
                                            next[skillIndex] = e.target.value
                                            updateSkillset(key, { skillSet: next })
                                        }}
                                    />
                                    <Trash size={16} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteSkill(key, skillIndex)} />
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