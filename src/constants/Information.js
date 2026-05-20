/**
 * @typedef {'Components'} Category
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
  'Components/HoneycombGrid': {
    description:
      'Infinite hex-tessellated grid with Apple Watch–style fisheye distortion, drag-scroll inertia, and tap detection. Virtualized DOM pool — handles hundreds of cells at 60fps.',
    category: 'Components',
    name: 'HoneycombGrid',
    tags: ['grid', 'hex', 'fisheye', 'drag', 'virtualized', 'apple-watch']
  },
  'Components/PosterDrum': {
    description:
      'Drag-orbit cylinder of film posters with cinema HUD chrome — SVG grain, ember REC counter, italic-serif title rail. Single rAF loop, inertial release, keyboard arrows, reduced-motion-safe.',
    category: 'Components',
    name: 'PosterDrum',
    tags: ['3d', 'carousel', 'cylinder', 'cinema', 'drag', 'css-3d']
  }
};
