import { Input } from "../type"
import { useTheme } from "../../../context"


export function TextInput({ inputFor, text, placeholder, type, className, value, onChange }: Input){
    const { themeMode, toggleTheme } = useTheme()

    const inputBG = themeMode === 'light' ? 'bg-white' : 'bg-black/50'
    const inputFont = themeMode === 'light' ? 'text-black' : 'text-white/90'
    return (
        <div className={`flex flex-col justify-center space-y-0.5 ${className}`}>
            <label htmlFor={inputFor} className="uppercase font-mono text-xs text-gray-400">
                {text}
            </label>
            <input type={type || "text"} id={inputFor} placeholder={placeholder} value={value} onChange={onChange}
            className={`${inputBG} ${inputFont} text-sm  px-3 py-2  border-b border-gray-400/40 rounded-lg focus:outline-none focus:border-cyan-500`} />
        </div>
    )
}

export function TextAreaInput({ inputFor, text, placeholder, className, value, onChange }: Input){
    const { themeMode, toggleTheme } = useTheme()

    const inputBG = themeMode === 'light' ? 'bg-white' : 'bg-black/50'
    const inputFont = themeMode === 'light' ? 'text-black' : 'text-white/90'

    return (
        <div className="flex flex-col justify-center space-y-0.5">
            <label htmlFor={inputFor} className="uppercase font-mono text-xs text-gray-400">
                {text}
            </label>
            <textarea id={inputFor} placeholder={placeholder} value={value} onChange={onChange}
            className={`${inputBG} ${inputFont} ${className} text-sm  px-3 py-2  border-b border-gray-400/40 rounded-lg focus:outline-none focus:border-cyan-500`} />
        </div>
    )
}
