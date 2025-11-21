export function getClanBadgeUrl(badgeId: number): string {
    // Supercell uses a specific asset server for badges.
    // The badgeId usually maps to a file name like "0_0.png" or similar.
    // Since we don't have the exact mapping logic without a huge lookup table,
    // we can use the official API asset URL pattern if we had the icon ID, 
    // or use a reliable third-party CDN that serves CR assets by ID.

    // For this implementation, we will use a reliable fallback pattern 
    // or a known CDN if available. 
    // RoyaleAPI and others use specific mappings.

    // Fallback to a generic high-quality badge if ID is missing
    if (!badgeId) return 'https://royaleapi.com/static/img/badges/16000040.png';

    // Constructing a likely URL (RoyaleAPI mirrors are reliable)
    // This is a simplification. In a real app, we'd map badgeId to the exact asset name.
    return `https://royaleapi.com/static/img/badges/${badgeId}.png`;
}
