"use client"

import { TextAreaInput } from "./components"
import { useTheme } from "@/app/context"
import { useEffect, useState, useRef } from "react"
import type { Hero } from "@/app/type"
import type { SaveStatus } from "../type"
import { apiClient } from "@/app/services"
import Nav from "./nav"

type HeroPayload = {
    greeting: string
    subtitle: string
    description: string
    expStart: string
    email: string
    profile: string
    imageBG: string
    about: string
}

const defaultHeroPayload: HeroPayload = {
    greeting: "",
    subtitle: "",
    description: "",
    expStart: "",
    email: "placeholder@example.com",
    profile: "",
    imageBG: "",
    about: "",
}

export default function About(){

    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'

    const [heroData, setHeroData] = useState<Hero>()
    const [loading, setLoading] = useState<boolean>(true)
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const skipDirtyCheckRef = useRef<boolean>(true)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const response = await apiClient.get("/hero/");
                skipDirtyCheckRef.current = true
                setHeroData(response.data);
                setAbout(response.data.about);
            } catch (error) {
                console.error("Error fetching hero data:", error);
                setErrorMessage("Could not load about data. Refresh to try again.")
            }
            finally {
                setLoading(false)
            }
        })();
    }, []);

    const [ about, setAbout ] = useState<string>(heroData?.about || "")

    useEffect(() => {
        if (skipDirtyCheckRef.current) {
            skipDirtyCheckRef.current = false
            return
        }
        setIsDirty(true)
    }, [about])

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

    const handleSave = async () => {
        if (!about.trim()) {
            setSaveStatus("error")
            setErrorMessage("About text is required.")
            return
        }

        setSaveStatus("saving")
        try {
            let savedHero: Hero

            if (heroData?.id && heroData.id > 0) {
                const response = await apiClient.patch(`/hero/${heroData.id}/about`, {
                    about: about ?? "",
                })
                savedHero = response.data
            } else {
                const response = await apiClient.post("/hero/", {
                    ...defaultHeroPayload,
                    about: about ?? "",
                })
                savedHero = response.data
            }

            skipDirtyCheckRef.current = true
            setHeroData(savedHero)
            setAbout(savedHero.about)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            console.error("Error saving hero data:", error)
            setErrorMessage("Error saving about data. Please try again.")
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading about data...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <main className=" p-6 text-gray-500 space-y-4">
                <h2 className={` ${themeFont} ml-2`}>About Section</h2>
                {!heroData && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        Hero record not found yet. Enter about text and click Save to create it.
                    </div>
                )}
                <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                    <TextAreaInput inputFor="about-description" text="Description" className="whitespace-pre-line" placeholder="..." value={about} onChange={(e) => setAbout(e.target.value)}/>
                </div>
            </main>
        </div>
    )
}