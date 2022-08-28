import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { useEffect, useState } from 'react'
import { useLeafletContext } from '@react-leaflet/core'
import type { LayerGroup } from 'leaflet'
import useDeepCompareEffect from 'use-deep-compare-effect'

import type { GeomanProps } from './types'
import reference from './events/reference'
import layerEvents from './events/layer'
import globalEvents from './events/global'
import mapEvents from './events/map'

export default function GeomanControls({
  options = {},
  globalOptions = {},
  pathOptions = {},
  lang = 'en',
  eventDebugFn,
  ...handlers
}: GeomanProps): null {
  const [mounted, setMounted] = useState(false)
  const [handlersRef, setHandlersRef] = useState<Record<string, Function>>(
    process.env.NODE_ENV === 'development' ? handlers : {}
  )
  const { map, layerContainer } = useLeafletContext()
  const container = (layerContainer as LayerGroup) || map

  if (!container) {
    console.warn('[GEOMAN-CONTROLS] No map or container instance found')
    return null
  }

  useDeepCompareEffect(() => {
    if (!map.pm.controlsVisible()) {
      map.pm.addControls(options)
      map.pm.setPathOptions(pathOptions)
      map.pm.setGlobalOptions({
        layerGroup: container,
        ...globalOptions,
      })
      map.pm.setLang(lang)
      setMounted(true)
    }
    return () => {
      map.pm.removeControls()
      setMounted(false)
    }
  }, [options, globalOptions, pathOptions, lang, !map])

  useEffect(() => {
    const withDebug = Object.fromEntries(
      reference.map((handler) => [handler, handlers[handler] ?? eventDebugFn])
    )
    const layers = layerContainer
      ? container.getLayers()
      : map.pm.getGeomanLayers()
    if (mounted) {
      globalEvents(map, withDebug, 'on')
      mapEvents(map, withDebug, 'on')
      layers.forEach((layer) => layerEvents(layer, withDebug, 'on'))
    }
    return () => {
      globalEvents(map, withDebug, 'off')
      mapEvents(map, withDebug, 'off')
      layers.forEach((layer) => layerEvents(layer, withDebug, 'off'))
      if (process.env.NODE_ENV === 'development') setHandlersRef(handlers)
    }
  }, [
    mounted,
    process.env.NODE_ENV === 'development'
      ? Object.entries(handlers).every(([k, fn]) => handlersRef[k] === fn)
      : true,
  ])

  return null
}
