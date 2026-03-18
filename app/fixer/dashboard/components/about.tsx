"use client"

import { TextAreaInput } from "./components"
import { useTheme } from "@/app/context"
import { useEffect, useState } from "react"
import type { Hero } from "@/app/type"
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
    
    useEffect(() => {
        (async () => {
            try {
                const response = await apiClient.get("/hero/");
                setHeroData(response.data);
                setAbout(response.data.about);
            } catch (error) {
                console.error("Error fetching hero data:", error);
            }
            finally {
                setLoading(false)
            }
        })();
    }, []);

    const [ about, setAbout ] = useState<string>(heroData?.about || "")

    useEffect(() => {
        setIsDirty(true)
    }, [about])
    
    const handleSave = async () => {
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

            setHeroData(savedHero)
            setAbout(savedHero.about)
            setIsDirty(false)
        } catch (error) {
            console.error("Error saving hero data:", error)
        }
    }

    if (loading) {
        return <main className="p-6 text-gray-500">Loading about data...</main>
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
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