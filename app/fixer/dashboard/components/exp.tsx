"use client"

import { Plus, Trash } from "lucide-react";
import { TextInput } from "./components";
import { useTheme } from "@/app/context"
import { allWorkExp } from "@/app/data";
import { apiClient } from "@/app/services";
import { useEffect, useState } from "react";
import type { WorkExp } from "@/app/type";
import Nav from "./nav";

export default function Experience(){

    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [experiences, setExperiences] = useState<WorkExp[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/exp/")
                setExperiences(response.data)
            } catch (error) {
                console.error("Error fetching experiences:", error)
                setExperiences(allWorkExp)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateExperience = (index: number, patch: Partial<WorkExp>) => {
        setExperiences((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleAddExperience = async () => {
        try {
            const payload = {
                tag: "new-work",
                link: "",
                position: "",
                date: "",
                company: "",
                desc: [""],
                skill: [""],
            }
            const response = await apiClient.post("/exp/", payload)
            setExperiences((prev) => [...prev, response.data])
            setIsDirty(false)
        } catch (error) {
            console.error("Error creating experience:", error)
        }
    }

    const handleSave = async () => {
        try {
            const updates = await Promise.all(
                experiences.map(async (exp) => {
                    const payload = {
                        tag: exp.tag,
                        link: exp.link,
                        position: exp.position,
                        date: exp.date,
                        company: exp.company,
                        desc: exp.desc,
                        skill: exp.skill,
                    }
                    const response = await apiClient.put(`/exp/${exp.id}`, payload)
                    return response.data as WorkExp
                })
            )

            setExperiences(updates)
            setIsDirty(false)
        } catch (error) {
            console.error("Error saving experiences:", error)
        }
    }

    const handleDeleteExperience = async (id: number) => {
        try {
            await apiClient.delete(`/exp/${id}`)
            setExperiences((prev) => prev.filter((item) => item.id !== id))
            setIsDirty(true)
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

    if (loading) {
        return <main className="p-6 text-gray-500">Loading work experience...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className="p-6 text-gray-500 space-y-5 w-full">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Work Experience</h2>
                    <button
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2"
                        onClick={handleAddExperience}
                    >
                        <Plus size={15} />
                        <span>Add</span>
                    </button>
                </div>
                {experiences.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No work experience records yet. Click Add to create your first one.
                    </div>
                )}
                {experiences.map((exp, key) => (
                    <div key={exp.id} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
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
                                <TextInput inputFor={`exp-desc-${exp.id}-${desckey}`} text="" className="w-full" placeholder="..." value={desc} onChange={(e) => {
                                    const nextDesc = [...exp.desc]
                                    nextDesc[desckey] = e.target.value
                                    updateExperience(key, { desc: nextDesc })
                                }}/>
                                <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteDescription(key, desckey)} />
                            </div>
                            ))}
                        </div>
                        <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700" onClick={() => handleAddDescription(key)}>
                            <Plus size={15} className=" " />
                            <span>Add Description</span>
                        </button>
                        <h3 className="uppercase font-mono text-xs text-gray-400">Skills</h3>
                        <div className="flex gap-4 flex-wrap">
                            {exp.skill.map((skill, skillkey) => (
                                <div key={skillkey} className="flex items-center gap-2">
                                    <TextInput inputFor={`exp-skills-${exp.id}-${skillkey}`} text="" className="w-fit" placeholder="..." value={skill} onChange={(e) => {
                                        const nextSkill = [...exp.skill]
                                        nextSkill[skillkey] = e.target.value
                                        updateExperience(key, { skill: nextSkill })
                                    }}/>
                                    <Trash size={16} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteSkill(key, skillkey)} />
                                </div>
                            ))}
                            <button className="flex items-center space-x-2 text-xs text-cyan-400 hover:text-cyan-700" onClick={() => handleAddSkill(key)}>
                                <Plus size={15} className=" " />
                                <span>Add Skill</span>
                            </button>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
                            <button className="btn-warning-outline px-4 py-2 rounded-lg text-red-500 text-xs" onClick={() => handleDeleteExperience(exp.id)}>
                                Delete Experience
                            </button>
                        </div>
                        
                    </div>
                ))}
            </main>
        </div>
    )
}