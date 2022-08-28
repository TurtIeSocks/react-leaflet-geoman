import type { Layer } from 'leaflet'

import type { HandlersWithDebug, Method } from '../types'

export default function layerEvents(
  layer: Layer,
  handlers: HandlersWithDebug,
  method: Method
) {
  // Drawing Mode
  if (handlers.onVertexAdded) {
    layer[method]('pm:vertexadded', handlers.onVertexAdded)
  }
  if (handlers.onSnapDrag) {
    layer[method]('pm:snapdrag', handlers.onSnapDrag)
  }
  if (handlers.onSnap) {
    layer[method]('pm:snap', handlers.onSnap)
  }
  if (handlers.onUnsnap) {
    layer[method]('pm:unsnap', handlers.onUnsnap)
  }
  if (handlers.onCenterPlaced) {
    layer[method]('pm:centerplaced', handlers.onCenterPlaced)
  }
  if (handlers.onChange) {
    layer[method]('pm:change', handlers.onChange)
  }

  // Edit Mode
  if (handlers.onEdit) {
    layer[method]('pm:edit', handlers.onEdit)
  }
  if (handlers.onUpdate) {
    layer[method]('pm:update', handlers.onUpdate)
  }
  if (handlers.onEnable) {
    layer[method]('pm:enable', handlers.onEnable)
  }
  if (handlers.onDisable) {
    layer[method]('pm:disable', handlers.onDisable)
  }
  if (handlers.onVertexRemoved) {
    layer[method]('pm:vertexremoved', handlers.onVertexRemoved)
  }
  if (handlers.onVertexClick) {
    layer[method]('pm:vertexclick', handlers.onVertexClick)
  }
  if (handlers.onMarkerDragStart) {
    layer[method]('pm:markerdragstart', handlers.onMarkerDragStart)
  }
  if (handlers.onMarkerDrag) {
    layer[method]('pm:markerdrag', handlers.onMarkerDrag)
  }
  if (handlers.onMarkerDragEnd) {
    layer[method]('pm:markerdragend', handlers.onMarkerDragEnd)
  }
  if (handlers.onLayerReset) {
    layer[method]('pm:layerreset', handlers.onLayerReset)
  }
  if (handlers.onIntersect) {
    layer[method]('pm:intersect', handlers.onIntersect)
  }

  // Drag Mode
  if (handlers.onDragStart) {
    layer[method]('pm:dragstart', handlers.onDragStart)
  }
  if (handlers.onDrag) {
    layer[method]('pm:drag', handlers.onDrag)
  }
  if (handlers.onDragEnd) {
    layer[method]('pm:dragend', handlers.onDragEnd)
  }
  if (handlers.onDragEnable) {
    layer[method]('pm:dragenable', handlers.onDragEnable)
  }
  if (handlers.onDragDisable) {
    layer[method]('pm:dragdisable', handlers.onDragDisable)
  }

  // Remove Mode
  if (handlers.onLayerRemove) {
    layer[method]('pm:remove', handlers.onLayerRemove)
  }

  // Cut Mode
  if (handlers.onLayerCut) {
    layer[method]('pm:cut', handlers.onLayerCut)
  }

  // Rotate Mode
  if (handlers.onLayerRotateEnable) {
    layer[method]('pm:rotateenable', handlers.onLayerRotateEnable)
  }
  if (handlers.onLayerRotateDisable) {
    layer[method]('pm:rotatedisable', handlers.onLayerRotateDisable)
  }
  if (handlers.onLayerRotateStart) {
    layer[method]('pm:rotatestart', handlers.onLayerRotateStart)
  }
  if (handlers.onLayerRotate) {
    layer[method]('pm:rotate', handlers.onLayerRotate)
  }
  if (handlers.onLayerRotateEnd) {
    layer[method]('pm:rotateend', handlers.onLayerRotateEnd)
  }

  // Text Mode
  if (handlers.onTextChange) {
    layer[method]('pm:textchange', handlers.onTextChange)
  }
}
