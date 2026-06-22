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
  },
  'Components/Toast': {
    description:
      'A stacked notification toaster where toasts pile up at a corner, fan apart and pause on hover, and dismiss on swipe or timeout, inspired by Sonner’s stacked toast interaction.',
    category: 'Components',
    name: 'Toast',
    tags: ['toast', 'notification', 'stack', 'swipe', 'motion']
  },
  'Components/Dock': {
    description:
      'A magnifying app dock whose tiles swell toward the cursor with spring physics, raise a tooltip on hover, and bounce on click, inspired by the magnification effect in Apple’s macOS Dock.',
    category: 'Components',
    name: 'Dock',
    tags: ['dock', 'macos', 'magnify', 'navigation', 'motion']
  },
  'Components/FloatingInput': {
    description:
      'A filled text field whose label rests as a placeholder then floats up and shrinks on focus or fill, with an accent underline that sweeps in from the center, an error state, and a password reveal toggle, inspired by Google’s Material Design floating label.',
    category: 'Components',
    name: 'FloatingInput',
    tags: ['form', 'input', 'floating-label', 'material', 'motion']
  },
  'TextAnimations/TypewriterText': {
    description:
      'Types each phrase out one character at a time, holds it, deletes it, and cycles to the next while a caret blinks alongside, with adjustable speeds and a screen-reader copy of the full text, inspired by the classic typewriter / terminal typing effect.',
    category: 'TextAnimations',
    name: 'TypewriterText',
    tags: ['text', 'typewriter', 'typing', 'caret', 'motion']
  },
  'Components/HoldButton': {
    description:
      'A button that only fires after you press and hold it long enough for the accent fill to sweep all the way across, then locks into a confirmed state with a check and a pulse, springing back if released early — inspired by the press-and-hold confirm interactions catalogued on Design Spells.',
    category: 'Components',
    name: 'HoldButton',
    tags: ['button', 'confirm', 'press-hold', 'destructive', 'motion']
  },
  'Components/MoodPicker': {
    description:
      'Emotion picker whose hero blob morphs into a unique shape and color for each mood, inspired by How We Feel on designspells.com.',
    category: 'Components',
    name: 'MoodPicker',
    tags: ['picker', 'mood', 'emotion', 'morph', 'feedback', 'motion']
  },
  'Components/PeekPassword': {
    description:
      'Login fields with a mascot that follows the caret as you type your email and covers its eyes for the password, inspired by TunnelBear on designspells.com.',
    category: 'Components',
    name: 'PeekPassword',
    tags: ['form', 'password', 'input', 'mascot', 'login', 'motion']
  },
  'Components/SwipeAction': {
    description:
      'List row you drag aside to reveal trailing actions, with snap-open detents and fling-to-trigger, inspired by the swipe-to-reveal interaction on designspells.com.',
    category: 'Components',
    name: 'SwipeAction',
    tags: ['swipe', 'list', 'drag', 'actions', 'gesture', 'motion']
  },
  'Components/SpotlightCard': {
    description: 'Card with a soft radial spotlight that tracks the pointer and brightens the nearest border.',
    category: 'Components',
    name: 'SpotlightCard',
    tags: ['card', 'spotlight', 'hover', 'pointer', 'glow']
  },
  'Components/BorderBeam': {
    description: 'Surface card framed by a luminous beam that travels continuously around its rounded border.',
    category: 'Components',
    name: 'BorderBeam',
    tags: ['card', 'border', 'beam', 'animated', 'glow']
  },
  'Components/ConfettiButton': {
    description: 'Pill button that bursts a spray of confetti particles outward on click, then lets them fall and fade.',
    category: 'Components',
    name: 'ConfettiButton',
    tags: ['button', 'confetti', 'particles', 'celebrate', 'motion']
  },
  'Backgrounds/Aurora': {
    description: 'Full-bleed animated aurora-borealis backdrop of soft drifting colored light over a dark surface.',
    category: 'Backgrounds',
    name: 'Aurora',
    tags: ['background', 'aurora', 'gradient', 'animated', 'ambient']
  },
  'Components/Marquee': {
    description: 'Seamless, dependency-free infinite scroller with hover-to-pause, configurable direction/speed/gap, and soft gradient edge fades.',
    category: 'Components',
    name: 'Marquee',
    tags: ['marquee', 'scroll', 'infinite', 'loop', 'logos']
  },
  'Components/RadialProgress': {
    description: 'Animated circular progress ring that sweeps from zero to its target percentage on mount while the centered number counts up in sync.',
    category: 'Components',
    name: 'RadialProgress',
    tags: ['progress', 'ring', 'circular', 'counter', 'svg']
  },
  'TextAnimations/ShinyText': {
    description: 'Muted text with a bright highlight that sweeps across the glyphs on a loop, like light glancing off brushed metal.',
    category: 'TextAnimations',
    name: 'ShinyText',
    tags: ['text', 'shimmer', 'shine', 'gradient', 'sweep']
  },
  'Backgrounds/Particles': {
    description: 'Canvas background of soft, slowly drifting particles that wrap around the edges and twinkle, with optional connecting lines.',
    category: 'Backgrounds',
    name: 'Particles',
    tags: ['canvas', 'background', 'particles', 'starfield', 'ambient']
  },
  'Components/RangeSlider': {
    description:
      'Dual-handle range selector with a minimum-gap guard, animated fill, and a value tooltip that springs over the active handle — inspired by the draggable price-range filters on designspells.com.',
    category: 'Components',
    name: 'RangeSlider',
    tags: ['slider', 'range', 'input', 'filter', 'price', 'dual-handle', 'accessible']
  },
  'Components/CommandPalette': {
    description:
      'An inline ⌘K command menu with live substring filtering, full keyboard navigation, and a selection highlight that magic-moves between rows, inspired by the Raycast and Linear command menus catalogued on designspells.com.',
    category: 'Components',
    name: 'CommandPalette',
    tags: ['command-palette', 'cmdk', 'search', 'keyboard', 'menu', 'motion']
  },
  'Components/ReorderList': {
    description:
      'A drag-to-reorder list built on motion’s Reorder primitives — rows lift on grab and spring into place, with optional handle-only dragging and arrow-key reordering for keyboard users, inspired by the drag-to-reorder list interaction documented on reactbits.dev.',
    category: 'Components',
    name: 'ReorderList',
    tags: ['list', 'drag', 'reorder', 'sortable', 'keyboard', 'motion']
  },
  'Components/Stepper': {
    description:
      'A quantity stepper whose −/+ buttons repeat at an accelerating rate the longer you hold them, with a direction-aware value roll, full keyboard support, and min/max clamping, inspired by the hold-to-repeat stepper interaction documented on reactbits.dev.',
    category: 'Components',
    name: 'Stepper',
    tags: ['stepper', 'input', 'number', 'quantity', 'press-hold', 'motion']
  },
  'Components/FlipCard': {
    description: 'A 3D flip card that reveals a back face on hover or click, with horizontal or vertical rotation and a spring-driven motion.',
    category: 'Components',
    name: 'FlipCard',
    tags: ['card', '3d', 'flip', 'hover', 'motion']
  },
  'Components/TagInput': {
    description: 'A chip-style tag input with animated add and remove, keyboard editing, duplicate guarding, and a max-tags limit.',
    category: 'Components',
    name: 'TagInput',
    tags: ['input', 'tags', 'chips', 'form', 'motion']
  },
  'Components/Tabs': {
    description: 'Animated tabs with a sliding indicator, crossfading panels, full keyboard navigation, and underline or pill variants.',
    category: 'Components',
    name: 'Tabs',
    tags: ['tabs', 'navigation', 'indicator', 'motion']
  },
  'Components/SpeedDial': {
    description: 'A floating action button that fans out staggered actions in any direction, with labels, hover or click triggering, and keyboard control.',
    category: 'Components',
    name: 'SpeedDial',
    tags: ['fab', 'menu', 'actions', 'button', 'motion']
  },
  'Backgrounds/Ripple': {
    description: 'An interactive ripple background that emits ambient concentric rings and spawns new ripples wherever you press.',
    category: 'Backgrounds',
    name: 'Ripple',
    tags: ['background', 'ripple', 'interactive', 'motion']
  },
  'ThreeD/CoverFlow': {
    description: 'A horizontal cover-flow carousel where side items angle back in perspective with reflections, draggable with snap and keyboard control.',
    category: 'ThreeD',
    name: 'CoverFlow',
    tags: ['3d', 'carousel', 'coverflow', 'drag', 'perspective']
  },
  'ThreeD/CardDeck': {
    description: 'A depth-stacked card deck where the front card swipes away and the rest rise forward through Z-space, with drag and keyboard control.',
    category: 'ThreeD',
    name: 'CardDeck',
    tags: ['3d', 'cards', 'deck', 'swipe', 'stack']
  },
  'ThreeD/CubeShowcase': {
    description: 'A rotating 3D cube that cycles through content faces, draggable to spin freely and snapping to the nearest face.',
    category: 'ThreeD',
    name: 'CubeShowcase',
    tags: ['3d', 'cube', 'rotate', 'drag', 'showcase']
  },
  'ThreeD/TagSphere': {
    description: 'A spherical tag cloud whose labels orbit a 3D sphere with idle drift and drag-driven inertia, depth-faded toward the back.',
    category: 'ThreeD',
    name: 'TagSphere',
    tags: ['3d', 'sphere', 'tags', 'cloud', 'drag']
  },
  'ThreeD/DepthTunnel': {
    description: 'A perspective tunnel of receding panels you fly through by dragging or scrolling, with depth fog and a looping path.',
    category: 'ThreeD',
    name: 'DepthTunnel',
    tags: ['3d', 'tunnel', 'depth', 'parallax', 'scroll']
  },
  'Components/ReactionBar': {
    description:
      'A horizontal emoji reaction picker whose glyphs magnify and tilt toward the cursor in a lens-like 3D warp, with single-select and a running count. Inspired by Telegram\'s magnifying emoji reaction picker.',
    category: 'Components',
    name: 'ReactionBar',
    tags: ['reactions', 'emoji', 'magnify', 'motion', 'social']
  },
  'Components/SplitPane': {
    description:
      'A resizable two-pane splitter with a draggable divider, snap points, double-click reset, and keyboard control — inspired by Amie’s drag-to-resize split view of calendar and todos.',
    category: 'Components',
    name: 'SplitPane',
    tags: ['layout', 'resize', 'split', 'drag', 'panels']
  },
  'Components/StageTracker': {
    description:
      "A multi-stage progress tracker with check-in pops and a shimmering active connector, inspired by Linear's import-assistant indicator.",
    category: 'Components',
    name: 'StageTracker',
    tags: ['progress', 'steps', 'stages', 'onboarding', 'motion']
  },
  'Scroll/ScrollStack': {
    description: 'Cards that pin and stack as you scroll, shrinking with depth — the Apple-style sticky stacking-cards interaction.',
    category: 'Scroll',
    name: 'ScrollStack',
    tags: ['scroll', 'sticky', 'cards', 'stack', 'motion']
  },
  'Backgrounds/Waves': {
    description: 'A full-bleed field of flowing, woven sine lines drifting across a flat surface — an animated line-wave backdrop.',
    category: 'Backgrounds',
    name: 'Waves',
    tags: ['background', 'waves', 'lines', 'canvas', 'ambient']
  },
  'Scroll/ScrollVelocity': {
    description: 'Marquee lanes that surge and flip direction with scroll velocity, easing back to an idle drift — the scroll-velocity marquee.',
    category: 'Scroll',
    name: 'ScrollVelocity',
    tags: ['scroll', 'velocity', 'marquee', 'motion', 'ticker']
  },
  'Backgrounds/Grid': {
    description: 'A quiet animated line grid with a soft bloom drifting across it — an ambient grid backdrop.',
    category: 'Backgrounds',
    name: 'Grid',
    tags: ['background', 'grid', 'lines', 'canvas', 'ambient']
  },
  'Scroll/ScrollReveal': {
    description: 'Children that fade, rise, and unblur in sequence as they scroll into view — the staggered reveal-on-scroll interaction.',
    category: 'Scroll',
    name: 'ScrollReveal',
    tags: ['scroll', 'reveal', 'stagger', 'in-view', 'motion']
  },
  'Backgrounds/Beams': {
    description: 'Soft vertical light beams drifting and breathing across a flat surface — an ambient light-beam backdrop.',
    category: 'Backgrounds',
    name: 'Beams',
    tags: ['background', 'beams', 'light', 'canvas', 'ambient']
  },
  'Scroll/HorizontalScroll': {
    description: 'A sticky section that turns vertical scroll into a horizontal card pan — the vertical-to-horizontal scroll gallery.',
    category: 'Scroll',
    name: 'HorizontalScroll',
    tags: ['scroll', 'horizontal', 'gallery', 'sticky', 'motion']
  },
  'Backgrounds/Threads': {
    description: 'A weave of vertical threads swaying with stacked sine harmonics like hanging silk — a flowing-thread backdrop.',
    category: 'Backgrounds',
    name: 'Threads',
    tags: ['background', 'threads', 'lines', 'canvas', 'ambient']
  },
  'Scroll/ScrollProgress': {
    description: 'A sticky reading-progress rail and circular percentage dial driven by scroll position — the reading-progress indicator.',
    category: 'Scroll',
    name: 'ScrollProgress',
    tags: ['scroll', 'progress', 'reading', 'indicator', 'motion']
  },
  'Backgrounds/Starfield': {
    description: 'Projected stars flying toward the viewer with warp streaks, resetting at the far plane — a warp-speed starfield backdrop.',
    category: 'Backgrounds',
    name: 'Starfield',
    tags: ['background', 'stars', 'warp', 'canvas', 'space']
  },
  'Scroll/ParallaxScroll': {
    description: 'A scroll panel whose decorative backdrop drifts slower than the foreground for depth — the parallax scroll section.',
    category: 'Scroll',
    name: 'ParallaxScroll',
    tags: ['scroll', 'parallax', 'depth', 'sticky', 'motion']
  },
  'Backgrounds/Plasma': {
    description: 'A single-hue plasma field flowing from stacked sine waves, rendered low-res and scaled up — a soft plasma backdrop.',
    category: 'Backgrounds',
    name: 'Plasma',
    tags: ['background', 'plasma', 'waves', 'canvas', 'ambient']
  },
  'Scroll/ScrollSpyNav': {
    description: 'A sticky side rail whose active link tracks the section in view and glides to any section on click — the scroll-spy docs nav.',
    category: 'Scroll',
    name: 'ScrollSpyNav',
    tags: ['scroll', 'spy', 'nav', 'in-view', 'docs']
  },
  'Backgrounds/Grain': {
    description: 'An animated film-grain speckle laid over a flat surface at a tasteful frame rate — a noise / grain backdrop.',
    category: 'Backgrounds',
    name: 'Grain',
    tags: ['background', 'grain', 'noise', 'canvas', 'texture']
  },
  'Backgrounds/FlowField': {
    description: 'Ambient canvas backdrop where particles drift along a slowly evolving noise vector field, leaving fading filament trails.',
    category: 'Backgrounds',
    name: 'FlowField',
    tags: ['background', 'canvas', 'flow field', 'particles', 'noise', 'ambient', 'generative']
  },
  'Scroll/StickyGridScroll': {
    description: 'A pinned grid that assembles as you scroll — tiles cascade up into place column by column while the whole grid eases down from a slight zoom.',
    category: 'Scroll',
    name: 'StickyGridScroll',
    tags: ['scroll', 'grid', 'sticky', 'reveal', 'stagger', 'parallax', 'motion']
  },
  'Components/GooeyMenu': {
    description: 'A floating speed-dial button whose plus trigger expands into a fan of circular actions that separate and merge like liquid metaballs via a shared gooey blur filter and springy motion stagger.',
    category: 'Components',
    name: 'GooeyMenu',
    tags: ['speed-dial', 'fab', 'gooey', 'metaball', 'menu', 'motion']
  },
  'Components/PasswordStrength': {
    description: 'A password field with a reveal toggle, an animated red-to-green segmented strength meter, and a live criteria checklist that springs each rule as it is satisfied.',
    category: 'Components',
    name: 'PasswordStrength',
    tags: ['password', 'input', 'strength-meter', 'validation', 'form', 'accessible']
  },
  'Components/RippleButton': {
    description: 'A flat-filled pill button that emits Material-style ripples from the exact pointer-down point, with concurrent self-cleaning ripples and a reduced-motion flash fallback.',
    category: 'Components',
    name: 'RippleButton',
    tags: ['button', 'ripple', 'material', 'motion', 'interaction', 'accessible']
  },
  'Scroll/PathDraw': {
    description: 'A self-contained scroll panel whose vector path strokes itself from start to end as you scroll, with an optional marker dot riding the drawn frontier and selectable wave, spiral, and route presets.',
    category: 'Scroll',
    name: 'PathDraw',
    tags: ['scroll', 'svg', 'path', 'motion', 'draw', 'sticky']
  },
  'Backgrounds/MeshGradient': {
    description: 'An animated mesh-gradient backdrop where several large soft color blobs orbit on smooth elliptical paths under a gentle blur, blending into a living, morphing mesh on a single canvas.',
    category: 'Backgrounds',
    name: 'MeshGradient',
    tags: ['background', 'mesh-gradient', 'canvas', 'gradient', 'ambient', 'animated']
  },
  'Components/BottomSheet': {
    description: 'A draggable mobile-style bottom sheet that springs up inside its own contained stage with a fading scrim, snap points, and velocity-aware drag-to-dismiss.',
    category: 'Components',
    name: 'BottomSheet',
    tags: ['bottom-sheet', 'drag', 'snap-points', 'dialog', 'motion', 'gesture']
  },
  'Backgrounds/Lightning': {
    description: 'Branching electric arcs that periodically strike across a dark surface, drawn on canvas with a bright core and soft glow.',
    category: 'Backgrounds',
    name: 'Lightning',
    tags: ['background', 'lightning', 'canvas', 'animated', 'ambient']
  },
  'Backgrounds/LiquidMetal': {
    description: 'A mercury-like metaball surface of merging blobs with a metallic sheen, rendered on canvas.',
    category: 'Backgrounds',
    name: 'LiquidMetal',
    tags: ['background', 'metaballs', 'liquid', 'canvas', 'ambient']
  },
  'Backgrounds/Constellation': {
    description: 'Drifting nodes linked by fading lines when they pass near each other, with a subtle pointer attraction.',
    category: 'Backgrounds',
    name: 'Constellation',
    tags: ['background', 'network', 'particles', 'canvas', 'ambient']
  },
  'Backgrounds/HexPulse': {
    description: 'A hexagon tessellation where concentric pulse waves light up cells as they ripple outward from a drifting origin.',
    category: 'Backgrounds',
    name: 'HexPulse',
    tags: ['background', 'hexagon', 'pulse', 'canvas', 'ambient']
  },
  'Backgrounds/NoiseContours': {
    description: 'Flowing topographic contour lines drawn from a layered noise field, drifting like an animated elevation map.',
    category: 'Backgrounds',
    name: 'NoiseContours',
    tags: ['background', 'contours', 'noise', 'canvas', 'ambient']
  },
  'Backgrounds/Rain': {
    description: 'Parallax rainfall of layered streaks falling at a wind angle, with near drops faster and brighter than far ones.',
    category: 'Backgrounds',
    name: 'Rain',
    tags: ['background', 'rain', 'parallax', 'canvas', 'ambient']
  },
  'Backgrounds/Vortex': {
    description: 'Particles spiralling inward around a central vortex with motion trails, like a whirlpool or galaxy.',
    category: 'Backgrounds',
    name: 'Vortex',
    tags: ['background', 'vortex', 'spiral', 'canvas', 'ambient']
  },
  'Scroll/ScrollTimeline': {
    description: 'A vertical timeline whose spine fills and whose nodes activate one by one as the section scrolls into view.',
    category: 'Scroll',
    name: 'ScrollTimeline',
    tags: ['scroll', 'timeline', 'progress', 'in-view', 'motion']
  },
  'Scroll/ScrollMask': {
    description: 'A panel revealed by an expanding clip-path wipe bound to scroll progress while the stage stays pinned.',
    category: 'Scroll',
    name: 'ScrollMask',
    tags: ['scroll', 'reveal', 'clip-path', 'sticky', 'motion']
  },
  'Scroll/ScrollFloat': {
    description: 'Rows that float into place with a perspective tilt and fade as they pass through the viewport on scroll.',
    category: 'Scroll',
    name: 'ScrollFloat',
    tags: ['scroll', 'float', 'perspective', 'in-view', 'motion']
  },
  'Scroll/ScrollZoom': {
    description: 'A pinned panel that scales up and fades in, bound to scroll progress, then holds while the track finishes.',
    category: 'Scroll',
    name: 'ScrollZoom',
    tags: ['scroll', 'zoom', 'scale', 'sticky', 'motion']
  },
  'Scroll/ReadingHighlight': {
    description: 'A paragraph whose words light up from dim to bright one by one as you scroll through the block.',
    category: 'Scroll',
    name: 'ReadingHighlight',
    tags: ['scroll', 'text', 'highlight', 'reading', 'motion']
  },
  'Scroll/ScrollRotate': {
    description: 'A geometric mark that rotates and scales bound to scroll progress while pinned in a sticky stage.',
    category: 'Scroll',
    name: 'ScrollRotate',
    tags: ['scroll', 'rotate', 'sticky', 'transform', 'motion']
  },
  'Scroll/ScrollSnap': {
    description: 'A vertical scroll-snap pager with full-height panels and a dot rail that tracks and jumps to the active panel.',
    category: 'Scroll',
    name: 'ScrollSnap',
    tags: ['scroll', 'snap', 'pager', 'navigation', 'motion']
  },
  'Components/ColorPicker': {
    description: 'A compact color picker with a draggable hue strip, preset swatches, and a live preview chip with its hex value.',
    category: 'Components',
    name: 'ColorPicker',
    tags: ['input', 'color', 'picker', 'swatches', 'accessible']
  },
  'Components/NotificationStack': {
    description: 'An iOS-style notification stack that collapses into a peeking pile and fans out into a readable, dismissible list.',
    category: 'Components',
    name: 'NotificationStack',
    tags: ['notification', 'stack', 'collapse', 'motion', 'list']
  },
  'Components/FileDrop': {
    description: 'A drag-and-drop upload zone that reacts on drag-over and lists dropped files as removable chips with sizes.',
    category: 'Components',
    name: 'FileDrop',
    tags: ['upload', 'drag-drop', 'file', 'input', 'accessible']
  },
  'Components/ImageCompare': {
    description: 'A before-and-after comparison slider with a draggable divider, operable by pointer and keyboard.',
    category: 'Components',
    name: 'ImageCompare',
    tags: ['compare', 'slider', 'before-after', 'drag', 'accessible']
  },
  'TextAnimations/SplitText': {
    description: 'Text that splits into characters or words and staggers in with a rise and fade when it scrolls into view.',
    category: 'TextAnimations',
    name: 'SplitText',
    tags: ['text', 'split', 'stagger', 'in-view', 'reveal']
  },
  'TextAnimations/BlurText': {
    description: 'Words that resolve from blurred and offset into sharp focus, staggered, when the text scrolls into view.',
    category: 'TextAnimations',
    name: 'BlurText',
    tags: ['text', 'blur', 'focus', 'in-view', 'reveal']
  },
  'Scroll/ScaleCarousel': {
    description:
      'A native scroll-snap swipe carousel with a coverflow-style scale feel — the centred card sits at full scale while neighbours shrink and dim, scroll-linked to each card\'s distance from the centre.',
    category: 'Scroll',
    name: 'ScaleCarousel',
    tags: ['scroll', 'carousel', 'coverflow', 'swipe', 'snap', 'scale']
  },
  'Scroll/ArcCarousel': {
    description:
      'A native scroll-snap swipe carousel with an arc feel — the centred card peaks while neighbours sink and fan-rotate outward, scroll-linked to each card\'s distance from the centre.',
    category: 'Scroll',
    name: 'ArcCarousel',
    tags: ['scroll', 'carousel', 'arc', 'swipe', 'snap', 'fan']
  },
  'Scroll/FocusCarousel': {
    description:
      'A native scroll-snap swipe carousel with a rack-focus feel — the centred card stays razor-sharp while neighbours blur, desaturate and dim, scroll-linked to each card\'s distance from the centre.',
    category: 'Scroll',
    name: 'FocusCarousel',
    tags: ['scroll', 'carousel', 'focus', 'blur', 'swipe', 'snap']
  },
  'Scroll/TiltCarousel': {
    description:
      'A native scroll-snap swipe carousel with a lightweight coverflow tilt — neighbours angle back in perspective and shrink as they leave the centre, scroll-linked to each card\'s distance from the centre.',
    category: 'Scroll',
    name: 'TiltCarousel',
    tags: ['scroll', 'carousel', 'coverflow', 'tilt', 'perspective', 'swipe']
  },
  'Backgrounds/LiquidChrome': {
    description:
      'A full-bleed WebGL shader of liquid chrome — drifting metaballs shaded with a reconstructed studio environment (mirror reflections, fresnel, key specular, ACES tone map), with one blob tracking the pointer. Reduced-motion-safe.',
    category: 'Backgrounds',
    name: 'LiquidChrome',
    tags: ['background', 'webgl', 'shader', 'chrome', 'metal', 'interactive']
  },
  'Backgrounds/LiquidGlass': {
    description:
      'A full-bleed WebGL shader of liquid glass — drifting metaballs rendered as refractive, dispersive glass over LiquidChrome\'s reconstructed studio environment, refraction blended with reflection by fresnel. One blob tracks the pointer. Reduced-motion-safe.',
    category: 'Backgrounds',
    name: 'LiquidGlass',
    tags: ['background', 'webgl', 'shader', 'glass', 'refraction', 'interactive']
  },
  'Backgrounds/Iridescence': {
    description:
      'A full-bleed WebGL shader of iridescent metal — LiquidChrome\'s studio-lit metaballs coated in a view-angle thin-film palette so the chrome shifts hue like oil on water. One blob tracks the pointer. Reduced-motion-safe.',
    category: 'Backgrounds',
    name: 'Iridescence',
    tags: ['background', 'webgl', 'shader', 'iridescent', 'metal', 'interactive']
  }
};
