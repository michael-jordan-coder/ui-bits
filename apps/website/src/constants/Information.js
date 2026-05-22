/**
 * @typedef {'Components' | 'ThreeD' | 'Scroll'} Category
 */
export const VARIANTS = ['JS-CSS', 'JS-TW', 'TS-CSS', 'TS-TW'];

/**
 * @typedef {'JS-CSS' | 'JS-TW' | 'TS-CSS' | 'TS-TW'} Variant
 */

/**
 * @typedef {Object} ComponentMetadata
 * @property {string} description
 * @property {Category} category
 * @property {string} name
 * @property {string[]} tags
 * @property {Variant[]} [variants]
 * @property {Record<string, string>} [meta]
 */

/**
 * @type {Record<string, ComponentMetadata>}
 */
export const componentMetadata = {
  'Components/FillButton': {
    description: 'A pill button with a radial GSAP fill that reveals from the cursor entry point and retreats from the exit.',
    category: 'Components',
    name: 'FillButton',
    tags: ['button', 'cta', 'gsap', 'hover']
  },
  'Scroll/HoneycombGrid': {
    description:
      'Infinite hex-tessellated grid with Apple Watch–style fisheye distortion, drag-scroll inertia, and tap detection. Virtualized DOM pool — handles hundreds of cells at 60fps.',
    category: 'Scroll',
    name: 'HoneycombGrid',
    tags: ['grid', 'hex', 'fisheye', 'drag', 'virtualized', 'apple-watch']
  },
  'ThreeD/PosterDrum': {
    description:
      'Drag-orbit cylinder of film posters with cinema HUD chrome — SVG grain, ember REC counter, italic-serif title rail. Single rAF loop, inertial release, keyboard arrows, reduced-motion-safe.',
    category: 'ThreeD',
    name: 'PosterDrum',
    tags: ['3d', 'carousel', 'cylinder', 'cinema', 'drag', 'css-3d']
  },
  'ThreeD/PosterHelix': {
    description: 'A 3D helix of posters that drifts on idle, scrubs on drag, and reports the active card in a HUD.',
    category: 'ThreeD',
    name: 'PosterHelix',
    tags: ['3d', 'helix', 'spiral', 'cinema', 'drag', 'css-3d']
  },
  'Components/Sidebar': {
    description:
      'A polished dashboard sidebar with icon-only collapse, drag-to-resize handle, and keyboard-accessible nav items.',
    category: 'Components',
    name: 'Sidebar',
    tags: ['navigation', 'sidebar', 'layout', 'collapsible', 'resizable']
  },
  'Components/Dropdown': {
    description:
      'A polished select dropdown with keyboard navigation, click-outside dismiss, optional per-option descriptions, and a smooth open animation.',
    category: 'Components',
    name: 'Dropdown',
    tags: ['form', 'select', 'dropdown', 'keyboard', 'accessible']
  }
};
