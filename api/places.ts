import type { Request, Response } from 'express';

export default async function handler(req: Request | any, res: Response | any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = (req.query.query as string) || 'best restaurants';
  const city = (req.query.city as string) || 'Glasgow';
  const limitParam = parseInt((req.query.limit as string) || '12', 10);
  const limit = Math.min(Math.max(1, limitParam), 20);
  const typeParam = req.query.type as string; // optional override for landmarks

  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY || process.env.VITE_GOOGLE_MAPS_BROWSER_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server Google Places API key not configured' });
  }

  const textQuery = city ? `${query} in ${city}` : query;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const fieldMask = [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.rating',
      'places.userRatingCount',
      'places.priceLevel',
      'places.primaryTypeDisplayName',
      'places.photos',
      'places.regularOpeningHours.weekdayDescriptions',
      'places.websiteUri',
      'places.googleMapsUri',
    ].join(',');

    const requestBody: Record<string, any> = {
      textQuery,
      maxResultCount: limit,
      languageCode: 'en-GB',
    };

    if (typeParam) {
      if (typeParam !== 'all') {
        requestBody.includedType = typeParam;
      }
    } else {
      requestBody.includedType = 'restaurant';
    }

    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `Places API error: ${response.statusText}`,
        details: errText,
      });
    }

    const data = await response.json();
    const places = (data.places || []).map((p: any) => {
      let priceBand: '£' | '££' | '£££' | '££££' = '££';
      let priceLevelNumeric = 2;

      switch (p.priceLevel) {
        case 'PRICE_LEVEL_INEXPENSIVE':
          priceBand = '£';
          priceLevelNumeric = 1;
          break;
        case 'PRICE_LEVEL_MODERATE':
          priceBand = '££';
          priceLevelNumeric = 2;
          break;
        case 'PRICE_LEVEL_EXPENSIVE':
          priceBand = '£££';
          priceLevelNumeric = 3;
          break;
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
          priceBand = '££££';
          priceLevelNumeric = 4;
          break;
      }

      const name = p.displayName?.text || 'Restaurant';
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') || p.id;

      const photos = (p.photos || []).map((photo: any) => ({
        name: photo.name,
        width: photo.widthPx,
        height: photo.heightPx,
        authorName: photo.authorAttributions?.[0]?.displayName,
        authorUri: photo.authorAttributions?.[0]?.uri,
      }));

      return {
        id: p.id,
        slug,
        name,
        cuisine: p.primaryTypeDisplayName?.text || 'Restaurant',
        neighbourhood: city,
        city,
        address: p.formattedAddress || `${city}, UK`,
        location: {
          lat: p.location?.latitude || 0,
          lng: p.location?.longitude || 0,
        },
        rating: p.rating || 4.5,
        reviewCount: p.userRatingCount || 120,
        priceBand,
        priceLevelNumeric,
        hours: p.regularOpeningHours?.weekdayDescriptions || [],
        website: p.websiteUri,
        mapsUrl: p.googleMapsUri,
        nextAvailableTime: '19:30',
        photos,
        features: {
          allowsDogs: true,
          disabledAccess: true,
          freeWifi: true,
          outdoorSeating: true,
          goodForGroups: true,
          servesVegetarianFood: true,
        },
        description: `${name} is one of ${city}'s premier dining rooms, celebrated for seasonal gastronomy and exceptional hospitality.`,
        source: 'google',
      };
    });

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({ places });
  } catch (error: any) {
    clearTimeout(timeoutId);
    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Places API request timed out' : error.message,
    });
  }
}
