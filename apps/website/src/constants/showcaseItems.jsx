import { componentPreviews } from './componentPreviews';

// Curated subset for the landing-hero bento. Previews come from the shared
// componentPreviews registry (also used by the /components/index catalog), so
// there is one source of truth for how a component renders in a card.
export const showcaseItems = [
  {
    key: 'poster-helix',
    name: 'Poster Helix',
    category: '3D',
    route: '/3-d/poster-helix',
    tags: ['3d', 'helix', 'drag'],
    render: componentPreviews['poster-helix']
  },
  {
    key: 'honeycomb-grid',
    name: 'Honeycomb Grid',
    category: 'Scroll',
    route: '/scroll/honeycomb-grid',
    tags: ['grid', 'hex', 'fisheye'],
    render: componentPreviews['honeycomb-grid']
  },
  {
    key: 'poster-drum',
    name: 'Poster Drum',
    category: '3D',
    route: '/3-d/poster-drum',
    tags: ['3d', 'carousel', 'cinema'],
    render: componentPreviews['poster-drum']
  },
  {
    key: 'fill-button',
    name: 'Fill Button',
    category: 'Components',
    route: '/components/fill-button',
    tags: ['button', 'gsap', 'hover'],
    render: componentPreviews['fill-button']
  },
  {
    key: 'dropdown',
    name: 'Dropdown',
    category: 'Components',
    route: '/components/dropdown',
    tags: ['select', 'keyboard', 'a11y'],
    render: componentPreviews.dropdown
  },
  {
    key: 'sidebar',
    name: 'Sidebar',
    category: 'Components',
    route: '/components/sidebar',
    tags: ['nav', 'layout', 'collapsible'],
    render: componentPreviews.sidebar
  },
  {
    key: 'scramble-text',
    name: 'Scramble Text',
    category: 'Text Animations',
    route: '/text-animations/scramble-text',
    tags: ['text', 'glyph', 'hover'],
    render: componentPreviews['scramble-text']
  },
  {
    key: 'dot-grid',
    name: 'Dot Grid',
    category: 'Backgrounds',
    route: '/backgrounds/dot-grid',
    tags: ['canvas', 'cursor', 'grid'],
    render: componentPreviews['dot-grid']
  }
];
