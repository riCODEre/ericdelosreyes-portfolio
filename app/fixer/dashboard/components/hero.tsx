"use client"

import { useTheme } from "@/app/context"
import { TextInput, TextAreaInput } from "./components"
import { useState, useEffect } from "react"
import Nav from "./nav"
import type { Hero } from "@/app/type"
import { apiClient } from "@/app/services"

export default function Hero(){
    const [heroData, setHeroData] = useState<Hero>()

    useEffect(() => {
        const fallbackHeroData = {
            id: 0, greeting: "", subtitle: "", description: "",
            expStart: "", email: "", profile: "", imageBG: "", about: ""
        };

        (async () => {
            try {
                const response = await apiClient.get("/hero/");
                setHeroData(response.data);
            } catch (error) {
                setHeroData(fallbackHeroData);
                console.error("Error fetching hero data:", error);
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

    useEffect(() => {
        if (!heroData) {
            return
        }

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
        setIsDirty(true)
    }, [greeting, subtitle, description, expStartDate, email, profile, imageBg])
    
    const handleSave = async () => {
        try {
            const updatedHeroData = {
                greeting,
                subtitle,
                description,
                expStart: expStartDate,
                email,
                profile,
                imageBG: imageBg,
                about: heroData?.about ?? "",
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
            <main className="p-6 text-gray-500 space-y-4">
                <h2 className={`ml-2 ${themeFont}`}>Hero Section</h2>
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

