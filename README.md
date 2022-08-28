# react-leaflet-geoman

[![npm version](https://badge.fury.io/js/react-leaflet-geoman-v2.svg)](https://badge.fury.io/js/react-leaflet-geoman-v2)

Basic React wrapper for the [Leaflet Geoman Plugin](https://github.com/geoman-io/leaflet-geoman)

## Installation

Add Peer Dependencies:

```sh
  // npm
  npm i react react-dom react-leaflet @geoman-io/leaflet-geoman-free

  // yarn
  yarn add react react-dom react-leaflet @geoman-io/leaflet-geoman-free
```

Add React Leaflet Geoman

```sh
  // npm
  npm i react-leaflet-geoman-v2

  // yarn
  yarn add react-leaflet-geoman-v2
```

## Usage

Since this package modifies the DOM directly, it can be imported either as hook or a component. At a minimum, it must be initiated inside of a `MapContainer` component. You can either draw shapes directly to the map container or wrap it in a `FeatureGroup` component. See the [Example](/example) code for a more detailed usage example.

```tsx
// as a React component
import { GeomanControls } from 'react-leaflet-geoman-v2'

export default function Drawing() {
  const handleChange = () => {
    console.log('Event fired!')
  }
  return (
    <FeatureGroup>
      <GeomanControls
        options={{
          position: 'topleft',
          drawText: false,
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false,
        }}
        onCreate={handleChange}
        onChange={(e) => console.log('onChange', e)}
      />
    </FeatureGroup>
  )
}

// as a hook
import { useGeomanControls } from 'react-leaflet-geoman-v2'

export default function Drawing() {
  useGeomanControls({
    options: { drawText: true, drawCircle: true },
    onCreate: (e) => console.log('onCreate', e),
    eventDebugFn: console.log,
  })
  return null
}
```

## Options

Respects all of the options, global options, and event handlers from Leaflet Geoman.

- [Options](https://github.com/geoman-io/leaflet-geoman/blob/0fabb8c2bfe0d40d1d9d6a827912bd53d8f6ad3b/leaflet-geoman.d.ts#L1083)
- [Global Options](https://github.com/geoman-io/leaflet-geoman/blob/0fabb8c2bfe0d40d1d9d6a827912bd53d8f6ad3b/leaflet-geoman.d.ts#L748)
- [Path Options](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/3b442d0c53fe1de99bcaf2b82fae33c22c42a052/types/leaflet/index.d.ts#L1000)
- [Lang Options](https://github.com/geoman-io/leaflet-geoman/blob/0fabb8c2bfe0d40d1d9d6a827912bd53d8f6ad3b/leaflet-geoman.d.ts#L526)

```ts
// Additional Props
interface GeomanProps extends GeomanHandlers {
  options?: PM.ToolbarOptions // See options link above
  globalOptions?: PM.GlobalOptions // See global options link above
  pathOptions?: L.PathOptions // See Leaflet PathOptions link above
  eventDebugFn?: EventDebugFn // optional function that can be used to debug events, such as `console.log`
  lang?: string // See lang options link above
}
```

## Event Handlers

Hooks into all of the Leaflet Geoman events. **Some events names have been altered slightly to allow more customization.** For example, `onMapCut` allows you to hook into the `pm:cut` event linked to the map container when a cut happens and `onLayerCut` allows you to hook a different callback into the `pm:cut` event linked to each of the layers.

```ts
interface GeomanHandlers {
  // Global (also applied to the map container)
  onGlobalDrawModeToggled?: PM.GlobalDrawModeToggledEventHandler
  onGlobalEditModeToggled?: PM.GlobalEditModeToggledEventHandler
  onGlobalDragModeToggled?: PM.GlobalDragModeToggledEventHandler
  onGlobalRemovalModeToggled?: PM.GlobalRemovalModeToggledEventHandler
  onGlobalCutModeToggled?: PM.GlobalCutModeToggledEventHandler
  onGlobalRotateModeToggled?: PM.GlobalRotateModeToggledEventHandler
  onButtonClick?: PM.ButtonClickEventHandler
  onActionClick?: PM.ActionClickEventHandler
  onKeyEvent?: PM.KeyboardKeyEventHandler
  onLangChange?: PM.LangChangeEventHandler

  // Map
  onCreate?: PM.CreateEventHandler
  onDrawStart?: PM.DrawStartEventHandler
  onDrawEnd?: PM.DrawEndEventHandler
  onMapRemove?: PM.RemoveEventHandler
  onMapCut?: PM.CutEventHandler
  onMapRotateEnable?: PM.RotateEnableEventHandler
  onMapRotateDisable?: PM.RotateDisableEventHandler
  onMapRotateStart?: PM.RotateStartEventHandler
  onMapRotate?: PM.RotateEventHandler
  onMapRotateEnd?: PM.RotateEndEventHandler

  // Layer
  onSnapDrag?: PM.SnapEventHandler
  onSnap?: PM.SnapEventHandler
  onUnsnap?: PM.SnapEventHandler
  onCenterPlaced?: PM.CenterPlacedEventHandler
  onEdit?: PM.EditEventHandler
  onUpdate?: PM.UpdateEventHandler
  onEnable?: PM.EnableEventHandler
  onDisable?: PM.DisableEventHandler
  onVertexAdded?: PM.VertexAddedEventHandler
  onVertexRemoved?: PM.VertexRemovedEventHandler
  onVertexClick?: PM.VertexClickEventHandler
  onMarkerDragStart?: PM.MarkerDragStartEventHandler
  onMarkerDrag?: PM.MarkerDragEventHandler
  onMarkerDragEnd?: PM.MarkerDragEndEventHandler
  onLayerReset?: PM.LayerResetEventHandler
  onIntersect?: PM.IntersectEventHandler
  onChange?: PM.ChangeEventHandler
  onTextChange?: PM.TextChangeEventHandler
  onDragStart?: PM.DragStartEventHandler
  onDrag?: PM.DragEventHandler
  onDragEnd?: PM.DragEndEventHandler
  onDragEnable?: PM.DragEnableEventHandler
  onDragDisable?: PM.DragDisableEventHandler
  onLayerRemove?: PM.RemoveEventHandler
  onLayerCut?: PM.CutEventHandler
  onLayerRotateEnable?: PM.RotateEnableEventHandler
  onLayerRotateDisable?: PM.RotateDisableEventHandler
  onLayerRotateStart?: PM.RotateStartEventHandler
  onLayerRotate?: PM.RotateEventHandler
  onLayerRotateEnd?: PM.RotateEndEventHandler
}
```

Layer Events are automatically applied when...

- `pm:create`/`onCreate` is fired
- `pm:cut`/`onMapCut` is fired
- If you add new layers to the `MapContainer` or `FeatureGroup` via a `ref`

Though generally not necessarily, you can import and apply layerEvents yourself with:
```ts
import { layerEvents } from 'react-leaflet-geoman-v2'

export default function Drawing({ geojson }) {
  React.useEffect(() => {
    L.geoJSON(geojson).eachLayer((layer) => {
      layerEvents(
        layer,
        {
          onDragStart: (e) => console.log('onDragStart', e),
          onDrag: (e) => console.log('onDrag', e),
          onDragEnd: (e) => console.log('onDragEnd', e),
        },
        'on'
      )
    })
  }, [geojson])
}
```


## TypeScript Note
This library is only typed as well as the base plugin, if you see an issue, [please consider contributing better types to Leaflet Geoman](https://github.com/geoman-io/leaflet-geoman/issues?q=is%3Aissue+is%3Aopen+typescript)!

## Contributing

- `yarn start` to start the Vite dev server with HMR enabled.
- With VS Code you can open a debugger in Chrome for IDE debugging
