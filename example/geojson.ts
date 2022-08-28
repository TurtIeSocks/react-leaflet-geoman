import type { FeatureCollection } from 'geojson'

export const GEOJSON: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.97408, 40.778104],
            [-73.97172, 40.78808],
            [-73.966141, 40.786001],
            [-73.97408, 40.778104],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.974982, 40.776187],
            [-73.965283, 40.774724],
            [-73.957644, 40.779534],
            [-73.959189, 40.782231],
            [-73.971034, 40.778819],
            [-73.974982, 40.776187],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: { type: 'Point', coordinates: [-73.979187, 40.783498] },
    },
    {
      type: 'Feature',
      properties: { radius: 20 },
      geometry: { type: 'Point', coordinates: [-73.961507, 40.786585] },
    },
    {
      type: 'Feature',
      properties: { radius: 15 },
      geometry: { type: 'Point', coordinates: [-73.977685, 40.771604] },
    },
    {
      type: 'Feature',
      properties: { radius: 160 },
      geometry: { type: 'Point', coordinates: [-73.967772, 40.769719] },
    },
    {
      type: 'Feature',
      properties: { radius: 200 },
      geometry: { type: 'Point', coordinates: [-73.961936, 40.771539] },
    },
    {
      type: 'Feature',
      properties: { radius: 40 },
      geometry: { type: 'Point', coordinates: [-73.958288, 40.774952] },
    },
    {
      type: 'Feature',
      properties: { radius: 70 },
      geometry: { type: 'Point', coordinates: [-73.971205, 40.772742] },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.988543, 40.769882],
            [-73.988543, 40.778787],
            [-73.980475, 40.778787],
            [-73.980475, 40.769882],
            [-73.988543, 40.769882],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-73.951684, 40.78977],
          [-73.949409, 40.775277],
          [-73.948594, 40.789932],
          [-73.951641, 40.792499],
        ],
      },
    },
  ],
}
