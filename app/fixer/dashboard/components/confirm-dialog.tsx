"use client"

import { useEffect } from "react"
import { useTheme } from "@/app/context"
import { AlertTriangle } from "lucide-react"

type ConfirmDialogProps = {
    open: boolean
    title: string
    message: string
    confirmLabel?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }: ConfirmDialogProps){
    const { themeMode } = useTheme()
    const bgTheme = themeMode === 'light' ? 'bg-white' : 'bg-[#0B0D10]'
    const bgFont = themeMode === 'light' ? 'text-black' : 'text-white'

    useEffect(() => {
        if (!open) return
        function handleKey(e: KeyboardEvent){
            if (e.key === "Escape") onCancel()
        }
        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [open, onCancel])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onCancel}>
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-message"
                className={`${bgTheme} ${bgFont} w-full max-w-sm rounded-xl border border-red-500/30 p-6 space-y-4 shadow-xl`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center space-x-2 text-red-500">
                    <AlertTriangle className="w-5 h-5"/>
                    <h3 id="confirm-dialog-title" className="font-mono font-bold">{title}</h3>
                </div>
                <p id="confirm-dialog-message" className="text-sm text-gray-400">{message}</p>
                <div className="flex justify-end space-x-3 pt-2">
                    <button type="button" onClick={onCancel} className="cursor-pointer px-4 py-2 rounded-lg text-sm border border-gray-500/40 hover:bg-white/10">
                        Cancel
                    </button>
                    <button type="button" onClick={onConfirm} className="cursor-pointer px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600">
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
