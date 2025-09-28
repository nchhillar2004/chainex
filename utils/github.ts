import { Config } from "@/config/config";
const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_COMMITS_CAP = 4;

async function githubFetch(endpoint: string) {
    try {
        const response = await fetch(`${GITHUB_API}${endpoint}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export const getDeployments = () => githubFetch(`/repos/${Config.github.username}/${Config.github.repo}/deployments`);
export const getCommits = () => githubFetch(`/repos/${Config.github.username}/${Config.github.repo}/commits?per_page=${GITHUB_COMMITS_CAP}`);
export const getLatestVersion = () => githubFetch(`/repos/${Config.github.username}/${Config.github.repo}/releases/latest`);

