import { act, render } from '@testing-library/react';
import * as React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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
    getGeomanLayers: vi.fn<() => unknown[]>(() => []),
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

  it('detaches event listeners from layers created after setup', () => {
    // Initially no layers exist; after setup, simulate a layer being created
    // via pm:create. On unmount, getGeomanLayers returns the new layer, and
    // its off() should be called for every wired Geoman event.
    const newLayer = {
      on: vi.fn(),
      off: vi.fn(),
    };

    const { unmount } = render(<GeomanControls onCreate={vi.fn()} />);

    // Simulate Geoman reporting the freshly-drawn layer at teardown time.
    pm.getGeomanLayers.mockReturnValue([newLayer as any]);

    unmount();

    // The teardown snapshot must hit the new layer at least once for
    // a Geoman event (proves we use getGeomanLayers at cleanup, not the
    // setup-time snapshot).
    expect(newLayer.off).toHaveBeenCalled();
  });

  it('does not strip the toolbar when a second instance unmounts', () => {
    // First instance mounts and "owns" the toolbar (controlsVisible: false → true).
    render(<GeomanControls />);
    expect(pm.addControls).toHaveBeenCalledTimes(1);

    // Second instance sees controlsVisible: true → must not add or remove controls.
    pm.controlsVisible.mockReturnValue(true);
    const onMount = vi.fn();
    const onUnmount = vi.fn();
    const { unmount } = render(<GeomanControls onMount={onMount} onUnmount={onUnmount} />);

    // addControls call count unchanged from the first mount.
    expect(pm.addControls).toHaveBeenCalledTimes(1);
    // onMount is gated on ownership, so it should not have fired for instance 2.
    expect(onMount).not.toHaveBeenCalled();

    unmount();

    // removeControls + onUnmount must not have fired for the non-owner instance.
    expect(pm.removeControls).not.toHaveBeenCalled();
    expect(onUnmount).not.toHaveBeenCalled();
  });

  it('cleans up safely when map.pm has been torn down before unmount', () => {
    const { unmount } = render(<GeomanControls />);

    // Simulate the parent MapContainer destroying the map before this
    // component unmounts.
    (map as { pm: unknown }).pm = undefined;

    expect(() => unmount()).not.toThrow();
  });

  it('fires onCreate exactly once per draw even when the handler updates state (regression for #13)', () => {
    // Issue #13: onCreate fired multiple times after the first shape was drawn
    // because the parent's setState (from inside onCreate) caused a re-render,
    // which re-registered the pm:create wrapper, leaving the previous one
    // attached to the map. Each subsequent draw fired every accumulated
    // wrapper. The ref-callback proxy fixes this by registering exactly one
    // map.on('pm:create', ...) at setup and never re-registering.

    // Wrapper component that triggers a re-render every time onCreate fires,
    // mimicking the user's setGeojson pattern from the issue.
    function Wrapper() {
      const [count, setCount] = React.useState(0);
      return (
        <>
          <span data-testid="count">{count}</span>
          <GeomanControls onCreate={() => setCount((c) => c + 1)} />
        </>
      );
    }

    const { getByTestId } = render(<Wrapper />);

    // Map.on('pm:create', ...) should have been called exactly once at setup.
    const pmCreateCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([eventName]) => eventName === 'pm:create'
    );
    expect(pmCreateCalls).toHaveLength(1);

    const fireCreate = pmCreateCalls[0][1] as (e: unknown) => void;

    // Simulate three sequential draws. Each one runs setState, which causes
    // a render. The proxy must NOT register a second wrapper. Wrap in act()
    // so the synchronous setState calls are flushed before assertions.
    act(() => {
      fireCreate({ layer: { on: vi.fn(), off: vi.fn() } });
    });
    act(() => {
      fireCreate({ layer: { on: vi.fn(), off: vi.fn() } });
    });
    act(() => {
      fireCreate({ layer: { on: vi.fn(), off: vi.fn() } });
    });

    expect(getByTestId('count').textContent).toBe('3');

    // After three draws + three state updates, still exactly one pm:create
    // registration on the map.
    const finalPmCreateCalls = (map.on as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([eventName]) => eventName === 'pm:create'
    );
    expect(finalPmCreateCalls).toHaveLength(1);
  });

  it('forwards events to the latest handler via the ref-callback proxy', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = render(<GeomanControls onCreate={handler1} />);

    // Find the proxy callback registered on the map for pm:create.
    const createCall = (map.on as ReturnType<typeof vi.fn>).mock.calls.find(
      ([eventName]) => eventName === 'pm:create'
    );
    if (!createCall) throw new Error('pm:create was not registered');
    const proxyCallback = createCall[1] as (e: unknown) => void;

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
