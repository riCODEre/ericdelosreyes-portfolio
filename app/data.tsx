
import { Cert, Project, Skill, WorkExp, Recommendation, Nav, Hero } from './type'

export const heroData: Hero = {
    id: 1,
    greeting: "Hi, I'm Eric",
    subtitle: "software-engineer",
    description: "Passionate about crafting efficient and innovative software solutions. With a strong foundation in programming and a drive for continuous learning, I am eager to contribute to impactful projects and grow as a developer.",
    expStart: "2025-09-01",
    email: "eric@example.com",
    profile: "/images/DelosReyes.jpg",
    imageBG: "/images/heroimage.jpg",
    about: "dd"
}

export const aboutData = `I’m a systems-oriented software engineer who enjoys breaking problems down to their fundamentals and rebuilding them into better solutions. I tend to question why a system exists before building it, which leads me to design architectures focused on maintainability, performance, and long-term scalability. Recently, I’ve been exploring AI-driven applications and how intelligent systems can support better decision-making. 

Outside of coding, I enjoy bending the rules of the games I play, the food I cook, and sometimes, just a normal person binging K-Drama and Anime.`

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
        title: "Design",
        skillSet: [
            "Canva",
            "Figma",
            "Archimate",
            "Draw.io",
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
            "Collaborated with junior and senior developers and partner clients on system planning, database design, and backend-frontend integration."
        ],
        skill: ["Apps Script", "React", "Vanilla JS", "Chakra UI", "Tailwind", "Github"]
    },
    {
        id: 2,
        tag: "sociofact",
        link: "/images/scf_icon_wbg.png",
        position: "Founder",
        date: "Dec 2025 - Present",
        company: "Sociofact",
        desc: [
            "Reduced claim verification time to under 1 minute per item, automating a process that normally takes 30+ minutes manually.",
            "Built a fully automated AI pipeline integrating two AI models for claim extraction and fact-checking, handling multi-modal content efficiently.",
            "Scaled verification throughput, enabling batch processing of dozens of claims per run with high accuracy and minimal manual oversight."
        ],
        skill: ["Django", "Python", "Cloud Run", "Docker", "NeonDB", "Sentry", "AI Integration"]
    }
]


export const allProjects: Project[] = [
    {
        id: 1,
        title: "Sociofact: AI-Integrated Content Verification System",
        type: "Startup",
        desc: "Built an AI-powered SaaS content verification pipeline, reducing claim validation from 30+ minutes to under one minute while enabling high-throughput, accurate processing of multi-modal content.",
        link: "https://sociofact.com/",
        skill: ["Django", "AI Models", "Google Cloud Run", "NeonDB", "Docker"]
    },
    {
        id: 2,
        title: "Intern Management System",
        type: "Work",
        desc: "Developed 11 modules for a full-stack intern management web app, collaborating with team members, integrating back-end services with the UI, and delivering the final system to executives.",
        link: "https://res.cloudinary.com/dpkzrqq51/image/upload/v1765001794/6cfe4156-1d75-401a-a30b-91dce64bbe1c.png",
        skill: ["React", "JavaScript", "Chakra UI", "Nest.js"]
    },
    {
        id: 3,
        title: "Data Management System",
        type: "Work",
        desc: "Developed a monolithic data management web application, implementing full CRUD, automated reporting, and optimized workflows across multiple modules for efficient data processing and management.",
        link: "https://res.cloudinary.com/dpkzrqq51/image/upload/v1765011755/4df1d163-ad20-42e9-ae84-d477f0a6f17a.png",
        skill: ["Apps Script", "Vanilla JS", "GSheet"]
    },
    {
        id: 4,
        title: "EduScore: Professor Evaluation System",
        type: "School",
        desc: "Developed the backend of a student evaluation platform, completing the full project and software development lifecycle to enable teacher ratings and reviews that support academic planning.",
        link: "https://github.com/riCODEre/EduScore",
        skill: ["Python", "Django", "SQLite"]
    },
    {
        id: 5,
        title: "BeTrails: Org Management System",
        type: "School",
        desc: "Developed a school organization management system, enabling students to explore and join organizations while allowing officers to manage memberships, integrating full-stack web functionality.",
        link: "https://github.com/riCODEre/Urbana_TheEnchants",
        skill: ["Node.js", "Express.js", "SQLite", "TailwindCSS"]
    },
    {
        id: 6,
        title: "Embedded Projects Compilation",
        type: "School",
        desc: "Showcased a series of embedded projects, culminating in an automated fermentation incubator and IoT-enabled delivery locker, demonstrating hands-on experience in both hardware and software development.",
        link: "https://github.com/riCODEre/EduScore",
        skill: ["IoT", "Embedded System", "ESP32", "Arduino Nano", "Firebase RTDB"]
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
        name: "A.G.",
        positionCompany: "IT Solutions Manager @ PFC - Aboitiz Foods Corp.",
        remark: "Eric has the technical competence and independent problem-solving ability, with strong foundations in coding and documentation. Recommended to further enhance skills in JavaScript, AWS, and Agile practices."
    }
]

export const allNav: Nav[] = [
    {
        name: "About",
        link: "#about"
    },
    {
        name: "Experience",
        link: "#experience"
    },
    {
        name: "Skills",
        link: "#skills"
    },
    {
        name: "Projects",
        link: "#projects"
    },
    {
        name: "Certification",
        link: "#certifications"
    },
    {
        name: "Recommendation",
        link: "#recommendations"
    },


]