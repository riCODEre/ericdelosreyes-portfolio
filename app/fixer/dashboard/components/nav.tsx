import { useTheme } from "@/app/context"
import { Save, Moon, Sun, Loader2, Check, AlertCircle } from "lucide-react"
import { NavProps } from "../type"

export default function Nav({ onClickSave, saveStatus = "idle", errorMessage }: NavProps){

    const { themeMode, toggleTheme } = useTheme()

    const isSaving = saveStatus === "saving"

    return (
        <nav className="text-sm text-bold h-1/9 w-full border-b border-cyan-500/20 p-5 flex items-center justify-between">
            <button type="button" className="cursor-pointer border hover:shadow-[0_0_20px_5px_rgba(0,184,219,0.5)] border-cyan-500/40 p-2 transition-all duration-300" onClick={toggleTheme} aria-label="Toggle theme">
                {themeMode === 'light' ? <Sun size={15}/> : <Moon size={15}/>}
            </button>
            <div className="flex items-center justify-end space-x-4">
                {saveStatus === "success" && (
                    <span className="flex items-center space-x-1 text-green-500 text-xs" role="status">
                        <Check className="w-4 h-4"/>
                        <span>Saved</span>
                    </span>
                )}
                {saveStatus === "error" && (
                    <span className="flex items-center space-x-1 text-red-500 text-xs" role="alert">
                        <AlertCircle className="w-4 h-4"/>
                        <span>{errorMessage || "Save failed. Try again."}</span>
                    </span>
                )}
                <button
                    type="button"
                    onClick={onClickSave}
                    disabled={isSaving}
                    aria-busy={isSaving}
                    className="btn-primary px-5 py-2 rounded-lg text-black space-x-1 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                    <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
            </div>

        </nav>
    )
}
