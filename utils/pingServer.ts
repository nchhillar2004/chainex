import { Config } from "@/config/config";

export default async function pingServer() {
    const start = performance.now();

    await fetch(`${Config.baseUrl}/api/ping`);

    const end = performance.now();

    return Math.round(end-start);
}
