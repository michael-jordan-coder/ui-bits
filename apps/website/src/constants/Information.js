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
  },
  'TextAnimations/ScrambleText': {
    description:
      'Text that resolves from cycling glyphs into the final string — replays on hover/focus or runs once in view. Single rAF loop, reduced-motion-safe, with a screen-reader copy of the real text.',
    category: 'TextAnimations',
    name: 'ScrambleText',
    tags: ['text', 'scramble', 'glyph', 'hover', 'decode']
  },
  'Backgrounds/DotGrid': {
    description:
      'Canvas dot field that brightens and swells toward the cursor, with a click shock-ripple. Single rAF loop, devicePixelRatio-aware, reduced-motion-safe.',
    category: 'Backgrounds',
    name: 'DotGrid',
    tags: ['canvas', 'background', 'cursor', 'grid', 'interactive']
  },
  'Components/PillNav': {
    description:
      'A tab navigation bar with a sliding pill highlight that magic-moves between tabs using a shared layout animation.',
    category: 'Components',
    name: 'PillNav',
    tags: ['navigation', 'tabs', 'motion', 'layout']
  },
  'Components/LikeButton': {
    description: 'A heart like button that pops on a spring and bursts a ring of particles, inspired by Instagram and X.',
    category: 'Components',
    name: 'LikeButton',
    tags: ['button', 'like', 'motion', 'particles', 'social']
  },
  'Components/SegmentedToggle': {
    description: 'A two-up segmented switch with a sliding pill and a springy icon pop on select, inspired by Airbnb.',
    category: 'Components',
    name: 'SegmentedToggle',
    tags: ['toggle', 'segmented', 'tabs', 'motion', 'layout']
  },
  'Components/AnimatedMenu': {
    description: 'A vertical menu whose row icons play a playful micro-animation on hover, inspired by Supabase and Mobbin.',
    category: 'Components',
    name: 'AnimatedMenu',
    tags: ['menu', 'navigation', 'hover', 'icons', 'motion']
  },
  'Components/RainbowButton': {
    description: 'A button wrapped in a continuously rotating conic-gradient rainbow that blooms into a glow on hover, inspired by Height.',
    category: 'Components',
    name: 'RainbowButton',
    tags: ['button', 'cta', 'gradient', 'rainbow', 'motion']
  },
  'Components/OtpInput': {
    description: 'A one-time-code input where digits pop in on a spring and the focus ring slides between cells, inspired by Family.',
    category: 'Components',
    name: 'OtpInput',
    tags: ['form', 'otp', 'input', 'motion', 'layout']
  },
  'Components/Tooltip': {
    description: 'A tooltip that springs in from the trigger with a directional slide and arrow, inspired by Discord.',
    category: 'Components',
    name: 'Tooltip',
    tags: ['tooltip', 'overlay', 'hover', 'motion', 'popover']
  },
  'Components/ScoreMeter': {
    description:
      'A circular gauge that counts up from zero while the ring sweeps in and its color climbs from red to green, inspired by the 1Password Watchtower score reveal.',
    category: 'Components',
    name: 'ScoreMeter',
    tags: ['gauge', 'score', 'counter', 'progress', 'motion']
  },
  'Components/RubberSlider': {
    description:
      'A slider whose bar stretches elastically when you drag the handle past either end, then springs back on release, inspired by the rubber-banding timer slider in Opal.',
    category: 'Components',
    name: 'RubberSlider',
    tags: ['slider', 'input', 'drag', 'elastic', 'motion']
  },
  'Components/StarRating': {
    description:
      'A star rating that fills on hover, springs through the stars when you commit, and bursts with sparkles plus a pop-in caption, inspired by the celebratory "Love this!" rating reveal on Netflix.',
    category: 'Components',
    name: 'StarRating',
    tags: ['rating', 'stars', 'input', 'motion', 'feedback']
  },
  'TextAnimations/NumberTicker': {
    description:
      'A number whose digits roll on vertical reels like a mechanical odometer whenever the value changes, with thousands grouping, decimals, and prefix/suffix, inspired by the rolling number transitions in the Family app.',
    category: 'TextAnimations',
    name: 'NumberTicker',
    tags: ['number', 'counter', 'odometer', 'roll', 'motion']
  },
  'Components/ThemeToggle': {
    description:
      'A sun/moon switch whose knob springs across the track while the icon morphs with a rotate-and-scale swap and stars fade in over the night sky, inspired by the classic animated dark-mode toggle interaction.',
    category: 'Components',
    name: 'ThemeToggle',
    tags: ['toggle', 'switch', 'theme', 'dark-mode', 'motion']
  },
  'Components/TiltCard': {
    description:
      'A card that tilts in 3D toward the pointer with a cursor-tracking specular glare and a spring-back on leave, wrapping any content, inspired by the pointer-tilt product cards popularized across the web.',
    category: 'Components',
    name: 'TiltCard',
    tags: ['3d', 'tilt', 'hover', 'card', 'motion']
  },
  'Components/AvatarStack': {
    description:
      'An overlapping facepile that fans apart on hover and lifts the avatar under the cursor while the others dim, with photo or initials fallbacks and a "+N" overflow chip, inspired by collaborator avatar stacks in apps like Linear and Slack.',
    category: 'Components',
    name: 'AvatarStack',
    tags: ['avatar', 'facepile', 'hover', 'group', 'motion']
  },
  'Components/CopyButton': {
    description:
      'A copy-to-clipboard button whose clipboard icon morphs into a check, whose label swaps to "Copied!", and which pulses a ring before reverting, inspired by the copy-confirmation buttons in apps like Vercel and Linear.',
    category: 'Components',
    name: 'CopyButton',
    tags: ['button', 'copy', 'clipboard', 'feedback', 'motion']
  },
  'Components/MagneticButton': {
    description:
      'A button pulled toward the cursor inside a magnetic field, with a parallax label and a spring-back on leave, inspired by the magnetic cursor buttons popularized by interaction studios like Cuberto.',
    category: 'Components',
    name: 'MagneticButton',
    tags: ['button', 'cursor', 'magnetic', 'spring', 'motion']
  },
  'Components/Accordion': {
    description:
      'An animated disclosure list that collapses each panel’s height to zero and rotates a chevron, with a single-open option and full keyboard navigation, inspired by the WAI-ARIA accordion pattern as refined by libraries like Radix UI.',
    category: 'Components',
    name: 'Accordion',
    tags: ['accordion', 'disclosure', 'collapse', 'accessible', 'motion']
  }
};
