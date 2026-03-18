
export type Menu = {
    name: string
    Icon: React.ElementType
    Comp: React.ElementType
}

export type Input = {
    inputFor: string
    text: string
    placeholder: string
    value?: any
    type?: string
    className?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export type NavProps = {
  onClickSave: () => void;
};
