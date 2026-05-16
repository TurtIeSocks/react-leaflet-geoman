import type { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import * as React from 'react';
import { FeatureGroup } from 'react-leaflet';

import { GeomanControls } from '../src/index';

interface Props {
  geojson: FeatureCollection;
  setGeojson: (geojson: FeatureCollection) => void;
}

export default function Geoman({ geojson, setGeojson }: Props) {
  const ref = React.useRef<L.FeatureGroup>(null);
  const hydratedRef = React.useRef(false);

  React.useEffect(() => {
    if (hydratedRef.current || !ref.current || !geojson) return;
    hydratedRef.current = true;

    L.geoJSON(geojson).eachLayer((layer) => {
      if (
        !(
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        )
      ) {
        return;
      }

      const feature = layer.feature;
      const radius = feature?.properties?.radius;
      if (radius && feature?.geometry.type === 'Point' && ref.current) {
        const [lng, lat] = feature.geometry.coordinates;
        new L.Circle([lat, lng], { radius }).addTo(ref.current);
      } else {
        ref.current?.addLayer(layer);
      }
    });
  }, [geojson]);

  const syncFeaturesToState = () => {
    const newGeo: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    const layers = ref.current?.getLayers();
    if (layers) {
      for (const layer of layers) {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const { lat, lng } = layer.getLatLng();
          newGeo.features.push({
            type: 'Feature',
            properties: {
              radius: layer.getRadius(),
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          newGeo.features.push(layer.toGeoJSON());
        }
      }
    }
    setGeojson(newGeo);
  };

  return (
    <FeatureGroup ref={ref}>
      <GeomanControls
        options={{
          position: 'topleft',
          drawText: false,
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false,
        }}
        // onMount={() => L.PM.setOptIn(true)}
        // onUnmount={() => L.PM.setOptIn(false)}
        eventDebugFn={console.log}
        onCreate={syncFeaturesToState}
        onChange={syncFeaturesToState}
        onUpdate={syncFeaturesToState}
        onEdit={syncFeaturesToState}
        onMapRemove={syncFeaturesToState}
        onMapCut={syncFeaturesToState}
        onDragEnd={syncFeaturesToState}
        onMarkerDragEnd={syncFeaturesToState}
      />
    </FeatureGroup>
  );
}
