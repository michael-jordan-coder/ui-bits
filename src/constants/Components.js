const getStarted = {
  introduction: () => import('../docs/Introduction.jsx'),
  installation: () => import('../docs/Installation.jsx'),
  mcp: () => import('../docs/McpServer.jsx')
};

const components = {
  'fill-button': () => import('../demo/Components/FillButtonDemo'),
  'honeycomb-grid': () => import('../demo/Components/HoneycombGridDemo'),
  'poster-drum': () => import('../demo/Components/PosterDrumDemo'),
  'poster-helix': () => import('../demo/Components/PosterHelixDemo')
};

export const componentMap = {
  ...getStarted,
  ...components
};
