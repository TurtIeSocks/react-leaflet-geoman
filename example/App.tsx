import * as React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { FeatureCollection } from 'geojson'

import GeomanWrapper from './Geoman'
import { GEOJSON } from './geojson'

export default function App() {
  const [geojson, setGeojson] = React.useState<FeatureCollection>(GEOJSON)

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '67%' }}>
        <MapContainer center={[40.777455, -73.969036]} zoom={15}>
          <TileLayer
            attribution="Map data Â© <a href='https://www.openstreetmap.org'>OpenStreetMap</a> contributors"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          />
          <GeomanWrapper geojson={geojson} setGeojson={setGeojson} />
        </MapContainer>
      </div>
      <div style={{ width: '33%', overflow: 'auto', padding: '0 20px' }}>
        <h3>{geojson.features.length} Features</h3>
        <pre>{JSON.stringify(geojson, null, 2)}</pre>
      </div>
    </div>
  )
}
