

export type Hero = {
    id: number
    greeting: string
    subtitle: string
    description: string
    expStart: string
    email: string
    profile: string
    imageBG: string
    about: string
}

export type Cert = {
    id?: number
    title: string
    issuer: string
    year: number
    link: string
    sortOrder?: number
}

export type Project = {
    id: number
    title: string
    type: string
    desc: string
    link: string
    skill: string[]
    sortOrder?: number
}

export type WorkExp = {
    id: number
    tag: string
    link: string
    position: string
    date: string
    company: string
    desc: string[]
    skill: string[]
    sortOrder?: number
}

export type Skill = {
    title: string
    skillSet: string[]
}

export type Recommendation = {
    id?: number
    name: string
    positionCompany: string
    remark: string 
    sortOrder?: number
}

export type Nav = {
    name: string
    link: string
}