"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { useState, useEffect, useRef } from "react"
import Nav from "./nav"
import type { Hero } from "@/app/type"
import type { SaveStatus } from "../type"
import { apiClient } from "@/app/services"
import axios from "axios"

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

const DEFAULT_HERO_EMAIL = "placeholder@example.com"

export default function Hero(){
    const [heroData, setHeroData] = useState<Hero>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        (async () => {
            try {
                const response = await apiClient.get("/hero/");
                setHeroData(response.data);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setHeroData(undefined)
                } else {
                    console.error("Error fetching hero data:", error);
                }
            }
            finally {
                setLoading(false)
            }
        })();
    }, []);

    const { themeMode } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'
    const [greeting, setGreeting] = useState<string>(heroData?.greeting || "")
    const [subtitle, setSubtitle] = useState<string>(heroData?.subtitle || "")
    const [description, setDescription] = useState<string>(heroData?.description || "")
    const [expStartDate, setExpStartDate] = useState<string>(heroData?.expStart || "")
    const [email, setEmail] = useState<string>(heroData?.email || "")
    const [profile, setProfile] = useState<string>(heroData?.profile || "")
    const [imageBg, setImageBg] = useState<string>(heroData?.imageBG || "")
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const skipDirtyCheckRef = useRef<boolean>(true)
    const saveStatusTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        if (!heroData) {
            return
        }

        skipDirtyCheckRef.current = true
        setGreeting(heroData.greeting)
        setSubtitle(heroData.subtitle)
        setDescription(heroData.description)
        setExpStartDate(heroData.expStart)
        setEmail(heroData.email)
        setProfile(heroData.profile)
        setImageBg(heroData.imageBG)
        setIsDirty(false)
    }, [heroData])


    useEffect(() => {
        if (skipDirtyCheckRef.current) {
            skipDirtyCheckRef.current = false
            return
        }
        setIsDirty(true)
    }, [greeting, subtitle, description, expStartDate, email, profile, imageBg])

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

    const validate = (): string | null => {
        if (!greeting.trim()) return "Greeting is required."
        if (!subtitle.trim()) return "Subtitle is required."
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
            const normalizedEmail = email.trim() || DEFAULT_HERO_EMAIL

            const updatedHeroData: HeroPayload = {
                greeting,
                subtitle,
                description,
                expStart: expStartDate,
                email: normalizedEmail,
                profile,
                imageBG: imageBg,
                about: heroData?.about ?? "",
            }

            let savedHero: Hero
            if (heroData?.id && heroData.id > 0) {
                const response = await apiClient.put(`/hero/${heroData.id}`, updatedHeroData)
                savedHero = response.data
            } else {
                const response = await apiClient.post("/hero/", updatedHeroData)
                savedHero = response.data
            }

            setHeroData(savedHero)
            setEmail(savedHero.email)
            setIsDirty(false)
            setSaveStatus("success")
        } catch (error) {
            let message = "Error saving hero data. Please try again."
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                message = "Hero save validation failed. Check the fields and try again."
                console.error("Hero save validation failed:", error.response.data)
            } else {
                console.error("Error saving hero data:", error)
            }
            setErrorMessage(message)
            setSaveStatus("error")
            return
        }

        saveStatusTimeoutRef.current = setTimeout(() => setSaveStatus("idle"), 2500)
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading hero data...</main>
    }


    return (
        <div>
            <Nav onClickSave={handleSave} saveStatus={saveStatus} errorMessage={errorMessage}/>
            <main className="p-6 text-gray-500 space-y-4">
                <h2 className={`ml-2 ${themeFont}`}>Hero Section</h2>
                {!heroData && (
                    <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl text-sm text-gray-400">
                        Hero record not found yet. Fill fields and click Save to create it.
                    </div>
                )}
                <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                    <TextInput inputFor="hero-greeting" text="Greeting Text" placeholder="..." value={greeting} onChange={(e) => setGreeting(e.target.value)} />
                    <TextInput inputFor="hero-subtitle" text="Subtitle" placeholder="..." value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                    <TextAreaInput inputFor="hero-description" text="Description" placeholder="..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <TextInput type="date" inputFor="hero-exp-start" text="Experience Start Date" placeholder="..." value={expStartDate} onChange={(e) => setExpStartDate(e.target.value)} />
                        <TextInput type="email" inputFor="hero-email" text="Contact Email" placeholder="..." value={email} onChange={(e) => setEmail(e.target.value)} />
                        <TextInput inputFor="hero-profile" text="Profile Image URL" placeholder="..." value={profile} onChange={(e) => setProfile(e.target.value)} />
                        <TextInput inputFor="hero-image-bg" text="Hero Image Background URL" placeholder="..." value={imageBg} onChange={(e) => setImageBg(e.target.value)} />
                    </div>
                </div>
            </main>
        </div>
    )
}

