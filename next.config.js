module.exports = {
  webpack: (config, { dev, isServer }) => {
    // Only run this for development on the client-side.
    if (dev && !isServer) {
      const ignored = [
        // Ignore changes to the JSON files to prevent full reload.
        /data\/chats\/.*\.json$/
      ];
      config.watchOptions.ignored = [
        ...config.watchOptions.ignored,
        ...ignored
      ];
    }
    return config;
  }
};
