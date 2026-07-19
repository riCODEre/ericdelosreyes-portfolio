"use client"

import { useTheme } from "@/app/context"
import { TextInput } from "./components"
import { ArrowDown, ArrowUp, Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState, useRef } from "react"
import type { Cert } from "@/app/type"
import type { SaveStatus } from "../type"
import Nav from "./nav"
import ConfirmDialog from "./confirm-dialog"

type CertRow = Cert & { id?: number }

const MIN_CERT_YEAR = 1950

export default function Certifications(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [certifications, setCertifications] = useState<CertRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [isAddingCertification, setIsAddingCertification] = useState<boolean>(false)
    const [pendingDeleteCertification, setPendingDeleteCertification] = useState<number | null>(null)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        ;(async () => {
            try {
                const response = await apiClient.get("/certifications/")
                setCertifications(response.data)
            } catch (error) {
                console.error("Error fetching certifications:", error)
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

    const updateCertification = (index: number, patch: Partial<CertRow>) => {
        setCertifications((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleMoveCertification = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= certifications.length) return

        setCertifications((prev) => {
            const next = [...prev]
            ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]
            return next
        })
        setIsDirty(true)
    }

    const handleAddCertification = async () => {
        if (isAddingCertification) return
        setIsAddingCertification(true)
        try {
            const response = await apiClient.post("/certifications/", {
                title: "New Certification",
                issuer: "",
                year: new Date().getFullYear(),
                link: "",
                sortOrder: certifications.length,
            })
            setCertifications((prev) => [...prev, response.data])
        } catch (error) {
            console.error("Error creating certification:", error)
        } finally {
            setIsAddingCertification(false)
        }
    }

    const validate = (): string | null => {
        const currentYear = new Date().getFullYear()
        for (let i = 0; i < certifications.length; i++) {
            const cert = certifications[i]
            if (!cert.title.trim()) return `Certification #${i + 1} is missing a title.`

            const yearNum = Number(cert.year)
            if (Number.isNaN(yearNum) || yearNum < MIN_CERT_YEAR || yearNum > currentYear + 1) {
                return `Certification #${i + 1} has an invalid year.`
            }
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
                certifications.map(async (cert, index) => {
                    const payload = {
                        title: cert.title,
                        issuer: cert.issuer,
                        year: Number(cert.year),
                        link: cert.link,
                        sortOrder: index,
                    }

                    if (cert.id) {
                        const updated = await apiClient.put(`/certifications/${cert.id}`, payload)
                        return updated.data as CertRow
                    }

                    const created = await apiClient.post("/certifications/", payload)
                    return created.data as CertRow
                })
            )

            setCertifications(updatedRows)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving certifications:", error)
            setErrorMessage("Error saving certifications. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    const handleDeleteCertification = async (index: number) => {
        const target = certifications[index]

        try {
            if (target.id) {
                await apiClient.delete(`/certifications/${target.id}`)
            }
            setCertifications((prev) => prev.filter((_, i) => i !== index))
        } catch (error) {
            console.error("Error deleting certification:", error)
        }
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading certifications...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Certifications</h2>
                    <button
                        type="button"
                        className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleAddCertification}
                        disabled={isAddingCertification}
                    >
                        <Plus size={15} />
                        <span>{isAddingCertification ? "Adding..." : "Add"}</span>
                    </button>
                </div>
                {certifications.length === 0 && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        No certifications yet. Click Add to create one.
                    </div>
                )}
                {certifications.map((cert, index) => (
                    <div key={cert.id ?? index} className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                        <div className="flex justify-between space-x-2 items-center">
                            <h3 className="text-sm text-cyan-500">#{index + 1}</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveCertification(index, "up")}
                                    disabled={index === 0}
                                    aria-label={`Move certification ${index + 1} up`}
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-cyan-400 hover:text-cyan-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    onClick={() => handleMoveCertification(index, "down")}
                                    disabled={index === certifications.length - 1}
                                    aria-label={`Move certification ${index + 1} down`}
                                >
                                    <ArrowDown size={16} />
                                </button>
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-700 cursor-pointer"
                                    onClick={() => setPendingDeleteCertification(index)}
                                    aria-label={`Delete certification ${index + 1}`}
                                >
                                    <Trash size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput inputFor={`cert-title-${index}`} text="Title" placeholder="..." value={cert.title} onChange={(e) => updateCertification(index, { title: e.target.value })}/>
                            <TextInput inputFor={`cert-issuer-${index}`} text="Issuer" placeholder="..." value={cert.issuer} onChange={(e) => updateCertification(index, { issuer: e.target.value })}/>
                            <TextInput inputFor={`cert-year-${index}`} text="Year" placeholder="..." value={cert.year} onChange={(e) => updateCertification(index, { year: Number(e.target.value) || 0 })}/>
                            <TextInput inputFor={`cert-link-${index}`} text="Link" placeholder="..." value={cert.link} onChange={(e) => updateCertification(index, { link: e.target.value })}/>
                        </div>
                    </div>
                ))}
                <p className="text-xs text-gray-500">{isDirty ? "Unsaved changes" : "Saved"}</p>
            </main>
            <ConfirmDialog
                open={pendingDeleteCertification !== null}
                title="Delete Certification"
                message="This will permanently delete this certification and cannot be undone."
                onConfirm={() => {
                    if (pendingDeleteCertification !== null) handleDeleteCertification(pendingDeleteCertification)
                    setPendingDeleteCertification(null)
                }}
                onCancel={() => setPendingDeleteCertification(null)}
            />
        </div>
    )
}