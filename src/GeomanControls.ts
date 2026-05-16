import '@geoman-io/leaflet-geoman-free';
import { useLeafletContext } from '@react-leaflet/core';
import type { LayerGroup, PM, PathOptions } from 'leaflet';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { globalEvents, layerEvents, mapEvents, reference } from './events';
import type { GeomanProps } from './types';

const EMPTY_OPTIONS: PM.ToolbarOptions = {};
const EMPTY_GLOBAL_OPTIONS: PM.GlobalOptions = {};
const EMPTY_PATH_OPTIONS: PathOptions = {};

export default function GeomanControls({
  options = EMPTY_OPTIONS,
  globalOptions = EMPTY_GLOBAL_OPTIONS,
  pathOptions = EMPTY_PATH_OPTIONS,
  lang = 'en',
  eventDebugFn,
  onMount,
  onUnmount,
  ...handlers
}: GeomanProps): null {
  // All hooks must be called unconditionally before any early return.
  const [mounted, setMounted] = useState(false);
  const { map, layerContainer } = useLeafletContext();
  const container = (layerContainer as LayerGroup) || map;

  // Store onMount/onUnmount in refs so the layout effect cleanup always
  // calls the latest version without needing to re-run the effect.
  const onMountRef = useRef(onMount);
  const onUnmountRef = useRef(onUnmount);
  onMountRef.current = onMount;
  onUnmountRef.current = onUnmount;

  // Track handler identity changes without triggering re-renders.
  // handlerVersion increments whenever any handler reference changes,
  // and is used as a stable dependency for the event-registration effect.
  // This fixes a production bug where handlers never re-registered because
  // the old dependency was always `true` in production builds.
  const handlerVersion = useRef(0);
  const prevHandlersRef = useRef<typeof handlers>({} as typeof handlers);
  const handlersHaveChanged =
    (Object.keys(handlers) as (keyof typeof handlers)[]).some(
      (k) => prevHandlersRef.current[k] !== handlers[k]
    ) ||
    (Object.keys(prevHandlersRef.current) as (keyof typeof handlers)[]).some(
      (k) => prevHandlersRef.current[k] !== handlers[k]
    );
  if (handlersHaveChanged) {
    handlerVersion.current++;
    prevHandlersRef.current = handlers;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: options is intentionally read only at mount time (Leaflet controls are configured once)
  useLayoutEffect(() => {
    if (!container) return;
    if (!map.pm.controlsVisible()) {
      map.pm.addControls(options);
      onMountRef.current?.();
      setMounted(true);
    }
    return () => {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalRemovalMode();
      map.pm.disableGlobalDragMode();
      map.pm.disableGlobalCutMode();
      map.pm.disableGlobalRotateMode();
      onUnmountRef.current?.();
      map.pm.removeControls();
      setMounted(false);
    };
  }, [container]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: map.pm is a stable Leaflet instance property
  useEffect(() => {
    if (!mounted || !container) return;
    map.pm.setPathOptions(pathOptions);
  }, [pathOptions, mounted, container]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: map.pm is a stable Leaflet instance property
  useEffect(() => {
    if (!mounted || !container) return;
    map.pm.setGlobalOptions({ layerGroup: container, ...globalOptions });
  }, [globalOptions, mounted, container]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: map.pm is a stable Leaflet instance property
  useEffect(() => {
    if (!mounted || !container) return;
    map.pm.setLang(lang);
  }, [lang, mounted, container]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: handlers are tracked via handlerVersion ref to avoid stale closure issues
  useEffect(() => {
    if (!mounted || !container) return;
    const withDebug = Object.fromEntries(
      reference.map((handler) => [handler, handlers[handler] ?? eventDebugFn])
    );
    const layers = layerContainer ? container.getLayers() : map.pm.getGeomanLayers();
    for (const layer of layers) layerEvents(layer, withDebug, 'on');
    globalEvents(map, withDebug, 'on');
    mapEvents(map, withDebug, 'on');

    return () => {
      globalEvents(map, withDebug, 'off');
      mapEvents(map, withDebug, 'off');
      for (const layer of layers) layerEvents(layer, withDebug, 'off');
    };
  }, [mounted, handlerVersion.current, container]);

  if (!container) {
    console.warn('[GEOMAN-CONTROLS] No map or container instance found');
  }
  return null;
}
