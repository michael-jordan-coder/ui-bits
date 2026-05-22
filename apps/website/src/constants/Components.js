const getStarted = {
  introduction: () => import('../docs/Introduction.jsx')
};

const components = {
  'fill-button': () => import('../demo/Components/FillButtonDemo'),
  'honeycomb-grid': () => import('../demo/Scroll/HoneycombGridDemo'),
  'poster-drum': () => import('../demo/ThreeD/PosterDrumDemo'),
  'poster-helix': () => import('../demo/ThreeD/PosterHelixDemo'),
  'sidebar': () => import('../demo/Components/SidebarDemo'),
  'dropdown': () => import('../demo/Components/DropdownDemo')
};

export const componentMap = {
  ...getStarted,
  ...components
};
