"use client"

import { TextInput, TextAreaInput } from "./components"
import { useTheme } from "@/app/context"
import { aboutData } from "@/app/data"
import { useEffect, useState } from "react"
import type { Hero } from "@/app/type"
import { apiClient } from "@/app/services"
import Nav from "./nav"

export default function About(){

    const { themeMode, toggleTheme } = useTheme()
    const themeFont = themeMode === 'light' ? 'text-black' : 'text-white'

    const [heroData, setHeroData] = useState<Hero>()
    const [isDirty, setIsDirty] = useState<boolean>(false)
    
    useEffect(() => {
        const fallbackHeroData = {
            id: 0, greeting: "", subtitle: "", description: "",
            expStart: "", email: "", profile: "", imageBG: "", about: ""
        };

        (async () => {
            try {
                const response = await apiClient.get("/hero/");
                setHeroData(response.data);
                setAbout(response.data.about);
            } catch (error) {
                setHeroData(fallbackHeroData);
                console.error("Error fetching hero data:", error);
            }
        })();
    }, []);

    const [ about, setAbout ] = useState<string>(heroData?.about || "")

    useEffect(() => {
        setIsDirty(true)
    }, [about])
    
    const handleSave = async () => {
        try {
            const updatedHeroData = {
                greeting: heroData?.greeting || "",
                subtitle: heroData?.subtitle || "",
                description: heroData?.description || "",
                expStart: heroData?.expStart || "",
                email: heroData?.email || "",
                profile: heroData?.profile || "",
                imageBG: heroData?.imageBG || "",
                about: about ?? "",
            }
            await apiClient.put("/hero/", updatedHeroData)
            setIsDirty(false)
        } catch (error) {
            console.error("Error saving hero data:", error)
        }
    }

    return (
        <div>
            <Nav onClickSave={handleSave}/>
            <main className=" p-6 text-gray-500 space-y-4">
                <h2 className={` ${themeFont} ml-2`}>About Section</h2>
                <div className="border border-cyan-500/20 bg-cyan-500/5 p-5 rounded-xl space-y-4">
                    <TextAreaInput inputFor="about-description" text="Description" className="whitespace-pre-line" placeholder="..." value={about} onChange={(e) => setAbout(e.target.value)}/>
                </div>
            </main>
        </div>
    )
}