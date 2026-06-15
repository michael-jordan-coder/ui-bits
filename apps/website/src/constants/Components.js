const getStarted = {
  introduction: () => import('../docs/Introduction.jsx')
};

const components = {
  'fill-button': () => import('../demo/Components/FillButtonDemo'),
  'honeycomb-grid': () => import('../demo/Scroll/HoneycombGridDemo'),
  'poster-drum': () => import('../demo/ThreeD/PosterDrumDemo'),
  'poster-helix': () => import('../demo/ThreeD/PosterHelixDemo'),
  'sidebar': () => import('../demo/Components/SidebarDemo'),
  'dropdown': () => import('../demo/Components/DropdownDemo'),
  'scramble-text': () => import('../demo/TextAnimations/ScrambleTextDemo'),
  'dot-grid': () => import('../demo/Backgrounds/DotGridDemo'),
  'pill-nav': () => import('../demo/Components/PillNavDemo'),
  'like-button': () => import('../demo/Components/LikeButtonDemo'),
  'segmented-toggle': () => import('../demo/Components/SegmentedToggleDemo'),
  'animated-menu': () => import('../demo/Components/AnimatedMenuDemo')
};

export const componentMap = {
  ...getStarted,
  ...components
};
