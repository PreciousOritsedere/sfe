import '@testing-library/jest-dom/vitest'

// Browser APIs that Radix primitives use and jsdom doesn't implement.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = () => false
  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}
Element.prototype.scrollIntoView ??= () => {}
globalThis.ResizeObserver ??= class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
