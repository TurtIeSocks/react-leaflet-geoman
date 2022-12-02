import type { PM, PathOptions } from 'leaflet'

export type Method = 'on' | 'off'

export type EventDebugFn = (input?: any) => void

export type ValueOf<T extends keyof GeomanHandlers> = GeomanHandlers[T]

export interface HandlersWithDebug extends GeomanHandlers {
  eventDebugFn?: EventDebugFn
}

export interface GeomanHandlers {
  // Global
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

  // map
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

  // layer
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

export interface GeomanProps extends GeomanHandlers {
  options?: PM.ToolbarOptions
  globalOptions?: PM.GlobalOptions
  pathOptions?: PathOptions
  eventDebugFn?: EventDebugFn
  onMount?: () => void
  onUnmount?: () => void
  lang?: PM.SupportLocales
}
