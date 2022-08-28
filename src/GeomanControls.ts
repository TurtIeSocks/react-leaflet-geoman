import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import { useEffect, useState, useMemo } from 'react'
import { useLeafletContext } from '@react-leaflet/core'
import type { LayerGroup } from 'leaflet'

import type { GeomanHandlers, GeomanProps } from './types'
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
  const { map, layerContainer } = useLeafletContext()
  const container = (layerContainer as LayerGroup) || map

  if (!container) {
    console.warn('[GEOMAN-CONTROLS] No map or container instance found')
    return null
  }

  const withDebug: GeomanHandlers = useMemo(
    () =>
      Object.fromEntries(
        reference.map((handler) => [handler, handlers[handler] ?? eventDebugFn])
      ),
    [Object.values(handlers).every((h) => !h)]
  )

  useEffect(() => {
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
    if (mounted) {
      globalEvents(map, withDebug, 'on')
      mapEvents(map, withDebug, 'on')
      ;(layerContainer
        ? container.getLayers()
        : map.pm.getGeomanLayers()
      ).forEach((layer) => layerEvents(layer, withDebug, 'on'))
    }
    return () => {
      globalEvents(map, withDebug, 'off')
      mapEvents(map, withDebug, 'off')
      ;(layerContainer
        ? container.getLayers()
        : map.pm.getGeomanLayers()
      ).forEach((layer) => layerEvents(layer, withDebug, 'off'))
    }
  }, [mounted, withDebug])

  return null
}
