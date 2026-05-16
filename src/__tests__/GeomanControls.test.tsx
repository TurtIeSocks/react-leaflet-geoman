import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @geoman-io/leaflet-geoman-free (side-effect import, no exports needed)
vi.mock('@geoman-io/leaflet-geoman-free', () => ({}));

// Build a minimal mock pm object that mirrors the Geoman API
function makePm() {
  return {
    addControls: vi.fn(),
    removeControls: vi.fn(),
    controlsVisible: vi.fn(() => false),
    setPathOptions: vi.fn(),
    setGlobalOptions: vi.fn(),
    setLang: vi.fn(),
    disableDraw: vi.fn(),
    disableGlobalEditMode: vi.fn(),
    disableGlobalRemovalMode: vi.fn(),
    disableGlobalDragMode: vi.fn(),
    disableGlobalCutMode: vi.fn(),
    disableGlobalRotateMode: vi.fn(),
    getGeomanLayers: vi.fn(() => []),
    on: vi.fn(),
    off: vi.fn(),
  };
}

// Build a minimal mock Leaflet map with pm attached
function makeMap(pm = makePm()) {
  return {
    pm,
    on: vi.fn(),
    off: vi.fn(),
  };
}

// Mock @react-leaflet/core to control the map context
vi.mock('@react-leaflet/core', () => ({
  useLeafletContext: vi.fn(),
}));

import { useLeafletContext } from '@react-leaflet/core';
import GeomanControls from '../GeomanControls';

const mockUseLeafletContext = vi.mocked(useLeafletContext);

describe('GeomanControls', () => {
  let pm: ReturnType<typeof makePm>;
  let map: ReturnType<typeof makeMap>;

  beforeEach(() => {
    pm = makePm();
    map = makeMap(pm);
    mockUseLeafletContext.mockReturnValue({
      map: map as any,
      layerContainer: null as any,
    } as any);
  });

  it('renders without crashing', () => {
    const { container } = render(<GeomanControls />);
    expect(container).toBeDefined();
  });

  it('calls addControls on mount', () => {
    render(<GeomanControls />);
    expect(pm.addControls).toHaveBeenCalledTimes(1);
  });

  it('calls removeControls on unmount', () => {
    const { unmount } = render(<GeomanControls />);
    unmount();
    expect(pm.removeControls).toHaveBeenCalledTimes(1);
  });

  it('calls each disable method exactly once on unmount (no duplicate calls)', () => {
    const { unmount } = render(<GeomanControls />);
    unmount();
    expect(pm.disableGlobalDragMode).toHaveBeenCalledTimes(1);
    expect(pm.disableGlobalCutMode).toHaveBeenCalledTimes(1);
    expect(pm.disableGlobalRotateMode).toHaveBeenCalledTimes(1);
    expect(pm.disableDraw).toHaveBeenCalledTimes(1);
    expect(pm.disableGlobalEditMode).toHaveBeenCalledTimes(1);
    expect(pm.disableGlobalRemovalMode).toHaveBeenCalledTimes(1);
  });

  it('calls onMount when provided', () => {
    const onMount = vi.fn();
    render(<GeomanControls onMount={onMount} />);
    expect(onMount).toHaveBeenCalledTimes(1);
  });

  it('calls onUnmount when provided', () => {
    const onUnmount = vi.fn();
    const { unmount } = render(<GeomanControls onUnmount={onUnmount} />);
    unmount();
    expect(onUnmount).toHaveBeenCalledTimes(1);
  });

  it('does not crash when container is null (hooks called unconditionally)', () => {
    mockUseLeafletContext.mockReturnValueOnce({
      map: null as any,
      layerContainer: null as any,
    } as any);
    // Should not throw a React hooks order error
    expect(() => render(<GeomanControls />)).not.toThrow();
  });

  it('does not skip addControls if already visible', () => {
    pm.controlsVisible.mockReturnValue(true);
    render(<GeomanControls />);
    expect(pm.addControls).not.toHaveBeenCalled();
  });

  it('forwards events to the latest handler via the ref-callback proxy', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = render(<GeomanControls onCreate={handler1} />);

    // Find the proxy callback registered on the map for pm:create.
    const createCall = (map.on as ReturnType<typeof vi.fn>).mock.calls.find(
      ([eventName]) => eventName === 'pm:create'
    );
    expect(createCall).toBeDefined();
    const proxyCallback = createCall![1] as (e: unknown) => void;

    // Initial render: first handler receives the event.
    const event1 = { layer: { on: vi.fn(), off: vi.fn() } };
    proxyCallback(event1);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).not.toHaveBeenCalled();

    // Re-render with new handler reference. No re-register occurs; the
    // proxy reads the latest handler from the ref on next invocation.
    rerender(<GeomanControls onCreate={handler2} />);

    const event2 = { layer: { on: vi.fn(), off: vi.fn() } };
    proxyCallback(event2);
    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });
});
