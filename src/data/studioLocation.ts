export const STUDIO_LOCATION = {
  name: 'ÁURA BY LN — Studio Beauty',
  website: 'https://aurabyln.com.br',
  street: 'Rua João Delarmelinda, nº 335',
  building: 'Prédio do Sinfrônio',
  unit: 'Apartamento 303',
  neighborhood: 'Grama',
  city: 'Afonso Cláudio',
  region: 'ES',
  postalCode: '29600-000',
  latitude: -20.0656706,
  longitude: -41.1151096,
};

const location = STUDIO_LOCATION;
const coordinates = `${location.latitude},${location.longitude}`;
const googleMaps = 'https://www.google.com/maps';

export const studioDirectionsUrl = `${googleMaps}/dir/?${new URLSearchParams({ api: '1', destination: coordinates })}`;
export const studioMapEmbedUrl = `${googleMaps}?${new URLSearchParams({ q: coordinates, z: '18', output: 'embed', hl: 'pt-BR' })}`;

export const studioLocality = `${location.neighborhood}, ${location.city} – ${location.region}`;
export const studioAddress = `${location.street}, ${location.building} — ${location.unit}, ${studioLocality}, CEP ${location.postalCode}`;

export const studioStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: location.name,
  url: location.website,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${location.street}, ${location.building} — ${location.unit}, ${location.neighborhood}`,
    addressLocality: location.city,
    addressRegion: location.region,
    postalCode: location.postalCode,
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: location.latitude,
    longitude: location.longitude,
  },
  hasMap: studioDirectionsUrl,
};
