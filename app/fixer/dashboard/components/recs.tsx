"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState } from "react"
import type { Recommendation } from "@/app/type"
import Nav from "./nav"

type RecommendationRow = Recommendation & { id?: number }

export default function Recommendations(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [recommendations, setRecommendations] = useState<RecommendationRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/recommendations/")
                setRecommendations(response.data)
            } catch (error) {
                console.error("Error fetching recommendations:", error)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    const updateRecommendation = (index: number, patch: Partial<RecommendationRow>) => {
        setRecommendations((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleAddRecommendation = async () => {
        try {
            const response = await apiClient.post("/recommendations/", {
                name: "",
                positionCompany: "",
                remark: "",
            })
            setRecommendations((prev) => [...prev, response.data])
            setIsDirty(false)
        } catch (error) {
            console.error("Error creating recommendation:", error)
        }
    }

    const handleSave = async () => {
        try {
            const updatedRows = await Promise.all(
                recommendations.map(async (reco) => {
                    const payload = {
                        name: reco.name,
                        positionCompany: reco.positionCompany,
                        remark: reco.remark,
                    }

                    if (reco.id) {
                        const updated = await apiClient.put(`/recommendations/${reco.id}`, payload)
                        return updated.data as RecommendationRow
                    }

                    const created = await apiClient.post("/recommendations/", payload)
                    return created.data as RecommendationRow
                })
            )

            setRecommendations(updatedRows)
            setIsDirty(false)
        } catch (error) {
            console.error("Error saving recommendations:", error)
        }
    }

    const handleDeleteRecommendation = async (index: number) => {
        const target = recommendations[index]

        try {
            if (target.id) {
                await apiClient.delete(`/recommendations/${target.id}`)
            }
            setRecommendations((prev) => prev.filter((_, i) => i !== index))
            setIsDirty(true)
        } catch (error) {
            console.error("Error deleting recommendation:", error)
        }
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading recommendations...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Recommendations</h2>
                    <button className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2" onClick={handleAddRecommendation}>
                        <Plus size={15} />
                        <span>Add</span>
                    </button>
                </div>
                {recommendations.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No recommendations yet. Click Add to create one.
                    </div>
                )}
                {recommendations.map((reco, index) => (
                    <div key={reco.id ?? index} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between space-x-2 items-center">
                            <h3 className="text-sm text-cyan-500">#{index + 1}</h3>
                            <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteRecommendation(index)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput inputFor={`recs-name-${index}`} text="Name" placeholder="..." value={reco.name} onChange={(e) => updateRecommendation(index, { name: e.target.value })}/>
                            <TextInput inputFor={`recs-post-company-${index}`} text="Position & Company" placeholder="..." value={reco.positionCompany} onChange={(e) => updateRecommendation(index, { positionCompany: e.target.value })}/>
                        </div>
                        <TextAreaInput inputFor={`recs-remark-${index}`} text="Remark" placeholder="..." value={reco.remark} onChange={(e) => updateRecommendation(index, { remark: e.target.value })}/>

                    </div>
                ))}
                <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
            </main>
        </div>
    )
}