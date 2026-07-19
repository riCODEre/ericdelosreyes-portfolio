"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState, useRef } from "react"
import type { Recommendation } from "@/app/type"
import type { SaveStatus } from "../type"
import Nav from "./nav"
import ConfirmDialog from "./confirm-dialog"

type RecommendationRow = Recommendation & { id?: number }

export default function Recommendations(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [recommendations, setRecommendations] = useState<RecommendationRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isAddingRecommendation, setIsAddingRecommendation] = useState<boolean>(false)
    const [pendingDeleteRecommendation, setPendingDeleteRecommendation] = useState<number | null>(null)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

    const updateRecommendation = (index: number, patch: Partial<RecommendationRow>) => {
        setRecommendations((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleMoveRecommendation = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= recommendations.length) return

        setRecommendations((prev) => {
            const next = [...prev]
            ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
            return next
        })
        setIsDirty(true)
    }

    const handleAddRecommendation = async () => {
        if (isAddingRecommendation) return
        setIsAddingRecommendation(true)
        try {
            const response = await apiClient.post("/recommendations/", {
                name: "",
                positionCompany: "",
                remark: "",
                sortOrder: recommendations.length,
            })
            setRecommendations((prev) => [...prev, response.data])
        } catch (error) {
            console.error("Error creating recommendation:", error)
        } finally {
            setIsAddingRecommendation(false)
        }
    }

    const validate = (): string | null => {
        for (let i = 0; i < recommendations.length; i++) {
            if (!recommendations[i].name.trim()) return `Recommendation #${i + 1} is missing a name.`
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
                recommendations.map(async (reco, index) => {
                    const payload = {
                        name: reco.name,
                        positionCompany: reco.positionCompany,
                        remark: reco.remark,
                        sortOrder: index,
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
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving recommendations:", error)
            setErrorMessage("Error saving recommendations. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    const handleDeleteRecommendation = async (index: number) => {
        const target = recommendations[index]

        try {
            if (target.id) {
                await apiClient.delete(`/recommendations/${target.id}`)
            }
            setRecommendations((prev) => prev.filter((_, i) => i !== index))
        } catch (error) {
            console.error("Error deleting recommendation:", error)
        }
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading recommendations...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Recommendations</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAddRecommendation}
                        disabled={isAddingRecommendation}
                    >
                        <Plus size={15} />
                        <span>{isAddingRecommendation ? "Adding..." : "Add"}</span>
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
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveRecommendation(index, "up")}
                                    disabled={index === 0}
                                    aria-label={`Move recommendation ${index + 1} up`}
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveRecommendation(index, "down")}
                                    disabled={index === recommendations.length - 1}
                                    aria-label={`Move recommendation ${index + 1} down`}
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setPendingDeleteRecommendation(index)}
                                    aria-label={`Delete recommendation ${index + 1}`}
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
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
            <ConfirmDialog
                open={pendingDeleteRecommendation !== null}
                title="Delete Recommendation"
                message="This will permanently delete this recommendation and cannot be undone."
                onConfirm={() => {
                    if (pendingDeleteRecommendation !== null) handleDeleteRecommendation(pendingDeleteRecommendation)
                    setPendingDeleteRecommendation(null)
                }}
                onCancel={() => setPendingDeleteRecommendation(null)}
            />
        </div>
    )
}