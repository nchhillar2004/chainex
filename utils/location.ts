export async function getUserLocation(): Promise<{
    geoData: string,
    country: string,
    timezone: string
}> {
    try {
        const response = await fetch('http://ip-api.com/json/');
        if (!response.ok) {
            throw new Error('Failed to fetch location data');
        }
        const data = await response.json();

        const geoData = `${data.region}, ${data.countryCode} (${data.zip})|${data.lat}-${data.lon}|${data.isp}|${data.query}`.trim();

        return { geoData: geoData, country: data.country, timezone: data.timezone };
    } catch (error) {
        console.error('Error fetching user location:', error);
        throw error;
    }
}
