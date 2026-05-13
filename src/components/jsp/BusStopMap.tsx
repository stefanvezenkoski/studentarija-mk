import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

const TICKET_OFFICES = [
  {
    id: '1',
    name: 'ЈСП Дирекција (Транспортен Центар)',
    position: { lat: 42.0009135, lng: 21.464915 },
    address: '2F27+9XF, Blvd. Alexander the Great, Skopje 1000',
    hours: '06:00 - 19:30',
    phone: '023174264'
  },
  {
    id: '2',
    name: 'ЈСП Билетарница - Автокоманда',
    position: { lat: 42.0007584, lng: 21.458525 },
    address: '2F25+8C7, Skopje 1000',
    phone: '023174264'
  },
  {
    id: '3',
    name: 'ЈСП пункт Ѓорче Петров',
    position: { lat: 42.010583, lng: 21.3655 },
    address: '2968+7F7, Blvd. Partizanski Odredi, Skopje 1000',
    phone: '023174264'
  },
  {
    id: '4',
    name: 'ЈСП Билетарница Карпош',
    position: { lat: 42.0013943, lng: 21.405726 },
    address: 'Blvd. Partizanski Odredi 85-73, Skopje 1000'
  },
  {
    id: '5',
    name: 'ЈСП Билетарница - Ѓорче Петров',
    position: { lat: 42.0066427, lng: 21.363530 },
    address: '2947+MC2, Skopje 1000',
    phone: '023174264'
  }
];

function MarkerWithInfoWindow({ office }: { office: typeof TICKET_OFFICES[0] }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(true);

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={office.position}
        onClick={() => setOpen(true)}
      >
        <div className="flex flex-col items-center">
          <div className="bg-primary text-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg border border-dark/20 mb-1 whitespace-nowrap">
            {office.name.includes('(') ? office.name.split('(')[0] : office.name.replace('ЈСП ', '')}
          </div>
          <Pin background="#FFD700" glyphColor="#000" borderColor="#000" />
        </div>
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="p-3 min-w-[200px] bg-white text-dark">
            <h4 className="font-black text-sm mb-2 uppercase italic tracking-tight">{office.name}</h4>
            <p className="text-[10px] font-bold text-zinc-500 mb-2 uppercase leading-tight">{office.address}</p>
            {office.hours && (
              <div className="flex items-center gap-2 text-[10px] font-black text-primary mb-1">
                <span className="bg-primary/10 px-1 rounded">РАБОТНО ВРЕМЕ: {office.hours}</span>
              </div>
            )}
            {office.phone && (
              <div className="text-[10px] font-black text-dark">
                ТЕЛ: {office.phone}
              </div>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function BusStopMap() {
  if (!hasValidKey) {
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-[3rem] p-12 text-center">
        <h3 className="text-xl font-bold text-white mb-4">Потребен е Google Maps API Клуч</h3>
        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
          За да ја видите мапата со билетари, треба да додадете GOOGLE_MAPS_PLATFORM_KEY во Secrets.
        </p>
        <div className="inline-flex flex-col items-start bg-black/30 p-6 rounded-2xl text-xs text-left font-mono">
          <p className="text-primary mb-2">// Како да додадете:</p>
          <p className="text-white">1. Одете во Settings (горе десно)</p>
          <p className="text-white">2. Изберете Secrets</p>
          <p className="text-white">3. Име: GOOGLE_MAPS_PLATFORM_KEY</p>
          <p className="text-white">4. Вредност: [вашиот клуч]</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full rounded-[3rem] overflow-hidden border-4 border-primary/20 shadow-2xl relative">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: 41.996, lng: 21.4116 }}
          defaultZoom={13}
          mapId="e5d0f1a9b8c7d6e5"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
          style={{ width: '100%', height: '100%' }}
        >
          {TICKET_OFFICES.map(office => (
            <MarkerWithInfoWindow key={office.id} office={office} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
