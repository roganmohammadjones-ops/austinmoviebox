// The default works on Expo web/EAS Hosting. Pages builds supply their subpath.
module.exports = ({ config }) => {
  const path = (process.env.EXPO_PUBLIC_WEB_BASE_PATH || '').replace(/^\/+|\/+$/g, '');
  if (path && !/^[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(path)) {
    throw new Error('EXPO_PUBLIC_WEB_BASE_PATH must be a URL path, such as /austinmoviebox');
  }
  return {
    ...config,
    experiments: { ...config.experiments, baseUrl: path ? `/${path}` : '' },
  };
};
