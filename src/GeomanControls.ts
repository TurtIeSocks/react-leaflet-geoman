import '@geoman-io/leaflet-geoman-free';
import { useLeafletContext } from '@react-leaflet/core';
import type { Layer, LayerGroup, PM, PathOptions } from 'leaflet';
import { useEffect, useLayoutEffect, useRef } from 'react';

import { globalEvents, layerEvents, mapEvents, reference } from './events';
import type { EventDebugFn, GeomanHandlers, GeomanProps, HandlersWithDebug } from './types';

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
  const { map, layerContainer } = useLeafletContext();
  const container = (layerContainer as LayerGroup) || map;

  // Hold the latest props in refs so registered listeners always invoke the
  // freshest user handler without needing to detach/re-attach on each change.
  const handlersRef = useRef<GeomanHandlers>(handlers);
  const eventDebugFnRef = useRef<EventDebugFn | undefined>(eventDebugFn);
  const onMountRef = useRef(onMount);
  const onUnmountRef = useRef(onUnmount);
  handlersRef.current = handlers;
  eventDebugFnRef.current = eventDebugFn;
  onMountRef.current = onMount;
  onUnmountRef.current = onUnmount;

  // biome-ignore lint/correctness/useExhaustiveDependencies: setup is keyed to container; prop updates flow through refs
  useLayoutEffect(() => {
    if (!container || !map?.pm) {
      if (!container) console.warn('[GEOMAN-CONTROLS] No map or container instance found');
      return;
    }

    // Only the instance that adds the toolbar owns its lifecycle. A second
    // GeomanControls mounted on the same map registers its own event handlers
    // but must not call onMount/onUnmount or addControls/removeControls,
    // otherwise it would tear down the first instance's toolbar on unmount.
    const ownsControls = !map.pm.controlsVisible();
    if (ownsControls) {
      map.pm.addControls(options);
      onMountRef.current?.();
    }

    // Stable proxy: each Geoman event name forwards to the latest handler via
    // handlersRef, falling back to eventDebugFn. Registered once per setup;
    // never needs to detach/re-attach when user handlers change identity.
    const proxy = Object.fromEntries(
      reference.map((name) => [
        name,
        (e: unknown) => {
          const handler = handlersRef.current[name] as ((arg: unknown) => void) | undefined;
          if (handler) handler(e);
          else eventDebugFnRef.current?.(e);
        },
      ])
    ) as HandlersWithDebug;

    const setupLayers = layerContainer ? container.getLayers() : map.pm.getGeomanLayers();
    for (const layer of setupLayers) layerEvents(layer as Layer, proxy, 'on');
    globalEvents(map, proxy, 'on');
    mapEvents(map, proxy, 'on');

    return () => {
      if (!map?.pm) return;

      // Snapshot layers at teardown time so we also detach from any layer
      // created after setup (e.g. drawn via pm:create wrapper).
      const teardownLayers = layerContainer ? container.getLayers() : map.pm.getGeomanLayers();
      for (const layer of teardownLayers) layerEvents(layer as Layer, proxy, 'off');
      globalEvents(map, proxy, 'off');
      mapEvents(map, proxy, 'off');

      if (ownsControls) {
        map.pm.disableDraw();
        map.pm.disableGlobalEditMode();
        map.pm.disableGlobalRemovalMode();
        map.pm.disableGlobalDragMode();
        map.pm.disableGlobalCutMode();
        map.pm.disableGlobalRotateMode();
        onUnmountRef.current?.();
        map.pm.removeControls();
      }
    };
  }, [container]);

  useEffect(() => {
    if (!container || !map?.pm) return;
    map.pm.setPathOptions(pathOptions);
  }, [pathOptions, container, map]);

  useEffect(() => {
    if (!container || !map?.pm) return;
    map.pm.setGlobalOptions({ layerGroup: container, ...globalOptions });
  }, [globalOptions, container, map]);

  useEffect(() => {
    if (!container || !map?.pm) return;
    map.pm.setLang(lang);
  }, [lang, container, map]);

  return null;
}
