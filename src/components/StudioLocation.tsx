import { useState } from 'react';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { STUDIO_LOCATION, studioDirectionsUrl, studioLocality, studioMapEmbedUrl } from '../data/studioLocation';

export function StudioAddress() {
  return (
    <address className="not-italic leading-relaxed">
      {STUDIO_LOCATION.street}<br />
      <strong>{STUDIO_LOCATION.building}</strong> — {STUDIO_LOCATION.unit}<br />
      {studioLocality}<br />
      CEP {STUDIO_LOCATION.postalCode}
    </address>
  );
}

export function StudioLocation() {
  const [showMap, setShowMap] = useState(false);

  return (
    <section id="localizacao" aria-labelledby="location-title" className="editorial-shell border-t border-[#CFC1AE] py-10 md:py-16">
      <div className="grid items-center gap-7 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-12">
        <div>
          <h2 id="location-title" className="mb-4 font-display">Nossa localização</h2>
          <StudioAddress />
          <a className="editorial-button gap-2" href={studioDirectionsUrl}>
            Como chegar <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div>
          <div id="studio-map" className="relative h-72 overflow-hidden rounded-xl border border-[#CFC1AE] bg-[#EAE2D6] md:h-80">
            {showMap ? (
              <iframe
                className="block h-full w-full border-0"
                src={studioMapEmbedUrl}
                title={`Google Maps — ${STUDIO_LOCATION.building}, ${STUDIO_LOCATION.name}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 px-5 text-center">
                <MapPin className="text-[#795A3E]" aria-hidden="true" />
                <p className="text-sm">Ao carregar o mapa, seu navegador se conecta ao Google Maps.</p>
                <button
                  type="button"
                  className="editorial-link min-h-[44px] cursor-pointer"
                  aria-controls="studio-map"
                  onClick={() => setShowMap(true)}
                >
                  Carregar mapa interativo
                </button>
              </div>
            )}
          </div>
          {showMap && <a className="editorial-link" href={studioDirectionsUrl}>Abrir no Google Maps ↗</a>}
        </div>
      </div>
    </section>
  );
}
