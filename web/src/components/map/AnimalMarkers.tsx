'use client';

import { Marker } from 'react-map-gl/maplibre';
import { useApp } from '@/context/AppContext';
import AnimalDot from '@/components/map/AnimalDot';

export default function AnimalMarkers() {
  const { state } = useApp();

  return (
    <>
      {state.animals.map((animal) => (
        <Marker
          key={animal.id}
          longitude={animal.position.lng}
          latitude={animal.position.lat}
          anchor="center"
        >
          <AnimalDot
            animal={animal}
            isSelected={state.selectedAnimal?.id === animal.id}
          />
        </Marker>
      ))}
    </>
  );
}
