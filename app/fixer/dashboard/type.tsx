
export type Menu = {
    name: string
    Icon: React.ElementType
    Comp: React.ElementType
}

export type Input = {
    inputFor: string
    text: string
    placeholder: string
    value?: string | number
    type?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export type SaveStatus = "idle" | "saving" | "success" | "error";

export type NavProps = {
  onClickSave: () => void;
  saveStatus?: SaveStatus;
  errorMessage?: string;
};
