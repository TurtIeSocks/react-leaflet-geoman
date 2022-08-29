import * as React from 'react'
import { FeatureGroup } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'
import * as L from 'leaflet'

import { GeomanControls } from '../src/index'

interface Props {
  geojson: FeatureCollection
  setGeojson: (geojson: FeatureCollection) => void
}

export default function Geoman({ geojson, setGeojson }: Props) {
  const ref = React.useRef<L.FeatureGroup>(null)

  React.useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (
          layer instanceof L.Polyline ||
          layer instanceof L.Polygon ||
          layer instanceof L.Marker
        ) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current)
          } else {
            ref.current?.addLayer(layer)
          }
        }
      })
    }
  }, [geojson])

  const handleChange = () => {
    const newGeo: FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    }
    const layers = ref.current?.getLayers()
    if (layers) {
      layers.forEach((layer) => {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const { lat, lng } = layer.getLatLng()
          newGeo.features.push({
            type: 'Feature',
            properties: {
              radius: layer.getRadius(),
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          })
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          newGeo.features.push(layer.toGeoJSON())
        }
      })
    }
    setGeojson(newGeo)
  }

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
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  )
}
