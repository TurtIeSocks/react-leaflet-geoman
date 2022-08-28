import type { Map } from 'leaflet'

import type { HandlersWithDebug, Method } from '../types'

export default function globalEvents(
  map: Map,
  handlers: HandlersWithDebug,
  method: Method
) {
  // Cut Mode
  if (handlers.onGlobalCutModeToggled) {
    map[method]('pm:globalcutmodetoggled', handlers.onGlobalCutModeToggled)
  }

  // Drag Mode
  if (handlers.onGlobalDragModeToggled) {
    map[method]('pm:globaldragmodetoggled', handlers.onGlobalDragModeToggled)
  }

  // Draw Mode
  if (handlers.onGlobalDrawModeToggled) {
    map[method]('pm:globaldrawmodetoggled', handlers.onGlobalDrawModeToggled)
  }

  // Edit Mode
  if (handlers.onGlobalEditModeToggled) {
    map[method]('pm:globaleditmodetoggled', handlers.onGlobalEditModeToggled)
  }

  // Misc Actions
  if (handlers.onButtonClick) {
    map[method]('pm:buttonclick', handlers.onButtonClick)
  }
  if (handlers.onActionClick) {
    map[method]('pm:actionclick', handlers.onActionClick)
  }
  if (handlers.onKeyEvent) {
    map[method]('pm:keyevent', handlers.onKeyEvent)
  }
  if (handlers.onLangChange) {
    map[method]('pm:langchange', handlers.onLangChange)
  }

  // Remove Mode
  if (handlers.onGlobalRemovalModeToggled) {
    map[method](
      'pm:globalremovalmodetoggled',
      handlers.onGlobalRemovalModeToggled
    )
  }

  // Rotate Mode
  if (handlers.onGlobalRotateModeToggled) {
    map[method](
      'pm:globalrotatemodetoggled',
      handlers.onGlobalRotateModeToggled
    )
  }
}
