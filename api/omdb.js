export default async function handler(req, res) {
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    // Clone query and remove 'path' to avoid OMDb "Invalid Request" errors
    const query = { ...req.query };
    delete query.path; 

    const searchParams = new URLSearchParams(query);
    searchParams.append('apikey', apiKey);

    const targetURL = `https://www.omdbapi.com/?${searchParams.toString()}`;

    try {
        const response = await fetch(targetURL);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Bureau Proxy Error" });
    }
}