"use client"

import { useTheme } from "@/app/context"
import { TextInput } from "./components"
import { Plus, Trash } from "lucide-react"
import { apiClient } from "@/app/services"
import { useEffect, useState } from "react"
import type { Cert } from "@/app/type"
import Nav from "./nav"

type CertRow = Cert & { id?: number }

export default function Certifications(){
    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [certifications, setCertifications] = useState<CertRow[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)

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

    const updateCertification = (index: number, patch: Partial<CertRow>) => {
        setCertifications((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
        setIsDirty(true)
    }

    const handleAddCertification = async () => {
        try {
            const response = await apiClient.post("/certifications/", {
                title: "New Certification",
                issuer: "",
                year: new Date().getFullYear(),
                link: "",
            })
            setCertifications((prev) => [...prev, response.data])
            setIsDirty(false)
        } catch (error) {
            console.error("Error creating certification:", error)
        }
    }

    const handleSave = async () => {
        try {
            const updatedRows = await Promise.all(
                certifications.map(async (cert) => {
                    const payload = {
                        title: cert.title,
                        issuer: cert.issuer,
                        year: Number(cert.year) || 0,
                        link: cert.link,
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
        } catch (error) {
            console.error("Error saving certifications:", error)
        }
    }

    const handleDeleteCertification = async (index: number) => {
        const target = certifications[index]

        try {
            if (target.id) {
                await apiClient.delete(`/certifications/${target.id}`)
            }
            setCertifications((prev) => prev.filter((_, i) => i !== index))
            setIsDirty(true)
        } catch (error) {
            console.error("Error deleting certification:", error)
        }
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading certifications...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className="p-6 text-gray-500 space-y-4">
                <div className="flex w-full justify-between items-center">
                    <h2 className={`ml-2 ${themeFont}`}>Certifications</h2>
                    <button className="flex items-center space-x-1 btn-primary rounded-lg text-sm text-black px-5 py-2" onClick={handleAddCertification}>
                        <Plus size={15} />
                        <span>Add</span>
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
                            <Trash size={18} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteCertification(index)} />
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
        </div>
    )
}