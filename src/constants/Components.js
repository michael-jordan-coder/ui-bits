const getStarted = {
  introduction: () => import('../docs/Introduction.jsx'),
  installation: () => import('../docs/Installation.jsx'),
  mcp: () => import('../docs/McpServer.jsx')
};

const components = {
  'fill-button': () => import('../demo/Components/FillButtonDemo'),
  'honeycomb-grid': () => import('../demo/Scroll/HoneycombGridDemo'),
  'poster-drum': () => import('../demo/ThreeD/PosterDrumDemo'),
  'poster-helix': () => import('../demo/ThreeD/PosterHelixDemo')
};

export const componentMap = {
  ...getStarted,
  ...components
};
