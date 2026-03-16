export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const queryString = new URLSearchParams({
    ...queryParams,
    api_key: apiKey,
  }).toString();

  const targetURL = `https://api.themoviedb.org/3/${path}?${queryString}`;

  try {
    const response = await fetch(targetURL);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from TMDB' });
  }
}