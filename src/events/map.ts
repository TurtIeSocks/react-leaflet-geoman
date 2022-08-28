import type { Map } from 'leaflet'

import layerEvents from './layer'
import type { HandlersWithDebug, Method } from '../types'

export default function mapEvents(
  map: Map,
  handlers: HandlersWithDebug,
  method: Method
) {
  // Cut
  if (handlers.onMapCut) {
    map[method]('pm:cut', (e) => {
      layerEvents(e.layer, handlers, 'off')
      layerEvents(e.layer, handlers, 'on')
      if (handlers.onMapCut) handlers.onMapCut(e)
    })
  }

  // Draw
  if (handlers.onCreate) {
    map[method]('pm:create', (e) => {
      layerEvents(e.layer, handlers, 'off')
      layerEvents(e.layer, handlers, 'on')
      if (handlers.onCreate) handlers.onCreate(e)
    })
  }
  if (handlers.onDrawStart) {
    map[method]('pm:drawstart', handlers.onDrawStart)
  }
  if (handlers.onDrawEnd) {
    map[method]('pm:drawend', handlers.onDrawEnd)
  }

  // Remove
  if (handlers.onMapRemove) {
    map[method]('pm:remove', handlers.onMapRemove)
  }

  // Rotate
  if (handlers.onMapRotateEnable) {
    map[method]('pm:rotateenable', handlers.onMapRotateEnable)
  }
  if (handlers.onMapRotateDisable) {
    map[method]('pm:rotatedisable', handlers.onMapRotateDisable)
  }
  if (handlers.onMapRotate) {
    map[method]('pm:rotate', handlers.onMapRotate)
  }
  if (handlers.onMapRotateStart) {
    map[method]('pm:rotatestart', handlers.onMapRotateStart)
  }
  if (handlers.onMapRotateEnd) {
    map[method]('pm:rotateend', handlers.onMapRotateEnd)
  }
}
