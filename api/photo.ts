import type { Request, Response } from 'express';

export default async function handler(req: Request | any, res: Response | any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const photoName = req.query.name as string;
  const widthParam = parseInt((req.query.w as string) || '800', 10);
  const width = Math.min(Math.max(200, widthParam), 1600);

  if (!photoName) {
    return res.status(400).json({ error: 'Missing photo name parameter' });
  }

  // Validate format: places/[placeId]/photos/[photoId]
  const photoPattern = /^places\/[^/]+\/photos\/[^/]+$/;
  if (!photoPattern.test(photoName)) {
    return res.status(400).json({ error: 'Invalid photo resource name format' });
  }

  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY || process.env.VITE_GOOGLE_MAPS_BROWSER_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server Google Places API key not configured' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const url = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${width}&key=${apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Photo media fetch failed: ${response.statusText}`,
      });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, max-age=86400, stale-while-revalidate=3600');
    return res.status(200).send(Buffer.from(buffer));
  } catch (error: any) {
    clearTimeout(timeoutId);
    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Photo request timed out' : error.message,
    });
  }
}
