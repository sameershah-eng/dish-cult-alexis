import type { Request, Response } from 'express';

export default async function handler(req: Request | any, res: Response | any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: 'Missing place ID parameter' });
  }

  const apiKey = process.env.GOOGLE_PLACES_SERVER_KEY || process.env.VITE_GOOGLE_MAPS_BROWSER_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server Google Places API key not configured' });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const fieldMask = [
      'id',
      'displayName',
      'formattedAddress',
      'location',
      'rating',
      'userRatingCount',
      'priceLevel',
      'primaryTypeDisplayName',
      'photos',
      'regularOpeningHours.weekdayDescriptions',
      'websiteUri',
      'googleMapsUri',
      'nationalPhoneNumber',
      'accessibilityOptions',
      'servesBreakfast',
      'servesBrunch',
      'servesVegetarianFood',
      'outdoorSeating',
      'allowsDogs',
      'goodForGroups',
      'reviews',
    ].join(',');

    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=en-GB`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': fieldMask,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: `Places API detail error: ${response.statusText}`,
        details: errText,
      });
    }

    const p = await response.json();

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

    const reviews = (p.reviews || []).map((rev: any, index: number) => ({
      id: `google-rev-${index}`,
      authorName: rev.authorAttribution?.displayName || 'Google Diner',
      authorPhoto: rev.authorAttribution?.photoUri,
      authorUri: rev.authorAttribution?.uri,
      rating: rev.rating || 5,
      date: rev.relativePublishTimeDescription || 'Recently',
      text: rev.text?.text || '',
      restaurantName: name,
      city: p.formattedAddress?.split(',')?.[1]?.trim() || '',
      breakdown: {
        food: rev.rating || 5,
        service: Math.max(4, (rev.rating || 5) - 0.2),
        atmosphere: rev.rating || 5,
        value: Math.max(4, (rev.rating || 5) - 0.3),
      },
    }));

    const restaurant = {
      id: p.id,
      slug,
      name,
      cuisine: p.primaryTypeDisplayName?.text || 'Restaurant',
      neighbourhood: p.formattedAddress?.split(',')?.[0]?.trim() || 'Central',
      city: p.formattedAddress?.split(',')?.[1]?.trim() || 'City',
      address: p.formattedAddress || '',
      location: {
        lat: p.location?.latitude || 0,
        lng: p.location?.longitude || 0,
      },
      phone: p.nationalPhoneNumber,
      website: p.websiteUri,
      mapsUrl: p.googleMapsUri,
      rating: p.rating || 4.7,
      reviewCount: p.userRatingCount || 100,
      priceBand,
      priceLevelNumeric,
      hours: p.regularOpeningHours?.weekdayDescriptions || [],
      features: {
        allowsDogs: p.allowsDogs ?? true,
        disabledAccess: p.accessibilityOptions?.wheelchairAccessibleEntrance ?? true,
        freeWifi: true,
        outdoorSeating: p.outdoorSeating ?? true,
        goodForGroups: p.goodForGroups ?? true,
        servesBreakfast: p.servesBreakfast ?? false,
        servesBrunch: p.servesBrunch ?? false,
        servesVegetarianFood: p.servesVegetarianFood ?? true,
      },
      description: `${name} provides an elevated dining experience with exceptional dishes, warm hospitality, and a distinct sense of place.`,
      photos,
      reviews,
      source: 'google',
    };

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600');
    return res.status(200).json({ restaurant });
  } catch (error: any) {
    clearTimeout(timeoutId);
    return res.status(500).json({
      error: error.name === 'AbortError' ? 'Places API detail request timed out' : error.message,
    });
  }
}
