
import { Cert, Project, Skill, WorkExp, Recommendation } from './type'



export const allSkill: Skill[] = [
    {
        title: "Language",
        skillSet: [
            "Python",
            "TypeScript",
            "JavaScript",
            "Kotlin",
            "C#",
            "C++",
        ]
    },
    {
        title: "Frontend",
        skillSet: [
            "React",
            "Next.js",
            "Tailwind CSS",
            "HTMX",
            "Jetpack Compose",
        ]
    },
    {
        title: "Backend",
        skillSet: [
            "Django",
            "Node.js",
            "Express",
            "ASP.NET"
        ]
    },
    {
        title: "DevOps",
        skillSet: [
            "Docker",
            "Linux",
            "Cloud Run",
            "Jenkins",
            "Railway",
            "GoDaddy",
            "Sentry",
            "Git / Github"
        ]
    },
    {
        title: "Database",
        skillSet: [
            "SQLite",
            "MySQL",
            "SSMS",
            "Firebase RTDB",
            "PostgreSQL",
        ]
    },
    {
        title: "AI",
        skillSet: [
            "Perplexity",
            "Gemini",
            "OpenAI",
        ]
    },
    {
        title: "IDE",
        skillSet: [
            "VSCode",
            "PyCharm",
            "Arduino",
            "Android Studio",
        ]
    },
    {
        title: "Collab",
        skillSet: [
            "JIRA",
            "Trello",
            "Discord",
            "Teams",
        ]
    },
]

export const allWorkExp: WorkExp[] = [
    {
        id: 1,
        tag: "aboitiz",
        link: "/images/aboitiz.jpg",
        position: "IT Solutions Engineer",
        date: "Sept 2025 - Dec 2025",
        company: "Aboitiz Foods Corp.",
        desc: [
            "Designed and developed web-based Data and Entity Management Systems, managing end-to-end data processing, storage, validation, and reporting.", 
            "Planned core application architecture, database workflows, and data processing pipelines while refining UI and optimizing performance.",
            "Led front-end development of 11 role-based modules using React, Nest.js, JavaScript, and Chakra UI.",
            "Collaborated with junior and senior developers and partner clients on system planning, database design, and backend-frontend integration."
        ],
        skill: ["Apps Script", "React", "NestJS", "Vanilla JS", "Chakra UI", "Tailwind", "Github"]
    },
    {
        id: 2,
        tag: "sociofact",
        link: "/images/scf_icon_wbg.png",
        position: "Founder",
        date: "Dec 2025 - Present",
        company: "Sociofact",
        desc: [
            "Leading development of scalable microservices and modern frontend applications. Architecting solutions for high-traffic systems.", 
            "Leading development of scalable microservices and modern frontend applications. Architecting solutions for high-traffic systems."
        ],
        skill: ["Django", "Python", "Cloud Run", "Docker", "NeonDB", "Sentry", "AI Integration"]
    }
]


export const allProjects: Project[] = [
    {
        id: 1,
        title: "Sociofact: AI-Integrated Content Verification System",
        type: "Startup",
        desc: "Started a startup that offers an AI-integrated SaaS that verifies any outputs (text, images, videos) of content creators with the factual information attachable to their published post.",
        link: "https://sociofact.com/",
        skill: ["Django", "Gemini", "Perplexity", "Cloud Run", "Docker"]
    },
    {
        id: 2,
        title: "Intern Management System",
        type: "Work",
        desc: "Developed 11 system modules for a comprehensive intern management web application, collaborating with an intern developer and integrating back-end services with the UI. Contributed to system planning, database design, and cross-team coordination with junior and senior developers. Worked directly with the client to prepare and deliver the final system presentation to the executive management team.",
        link: "https://res.cloudinary.com/dpkzrqq51/image/upload/v1765001794/6cfe4156-1d75-401a-a30b-91dce64bbe1c.png",
        skill: ["React", "JavaScript", "Chakra UI", "Nest.js"]
    },
    {
        id: 3,
        title: "Data Management System",
        type: "Work",
        desc: "Developed a monolithic data management web application using Google Apps Script with Google Sheets as the backend database. Implemented data upload, validation, filtering, editing, and full CRUD functionality across multiple modules, along with automated report generation and centralized data aggregation. Established the application architecture, database workflow, and optimized the UI and performance for efficient data processing and management.",
        link: "https://res.cloudinary.com/dpkzrqq51/image/upload/v1765011755/4df1d163-ad20-42e9-ae84-d477f0a6f17a.png",
        skill: ["Apps Script", "Vanilla JS", "GSheet"]
    },
    
    
]


export const allCert: Cert[] = [{
    title: "Get the most out of Jira",
    issuer: "Atlassian / LinkedIn",
    year: 2024,
    link: "https://www.linkedin.com/in/ericcode/details/certifications/#:~:text=Get%20the%20most,Project%20Management%20%C2%B7%20Jira"
}]

export const allReco: Recommendation[] = [
    {
        name: "Eric",
        positionCompany: "Sociofact",
        remark: "ahUlul"
    }
]