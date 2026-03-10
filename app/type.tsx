
export type Cert = {
    title: string
    issuer: string
    year: number
    link: string
}

export type Project = {
    id: number
    title: string
    type: string
    desc: string
    link: string
    skill: string[]
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
}

export type Skill = {
    title: string
    skillSet: string[]
}

export type Recommendation = {
    name: string
    positionCompany: string
    remark: string 
}