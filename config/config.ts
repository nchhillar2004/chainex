export const Config = {
    name: "ChainEX",
    description: "Student-only community platform",
    baseUrl: process.env.NODE_ENV==="development" ? "http://localhost:3000" : "https://chainex-prod.vercel.app/",
    github: {
        username: "nchhillar2004",
        repo: "chainex"
    },
    USER_CAP: 9999,
    UPLOAD_CAP_MB: 20,
}
