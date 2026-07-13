import base from './vite.config';

const allowedHosts = process.env.VITE_ALLOWED_HOSTS
  ?.split(',')
  .map((host) => host.trim())
  .filter(Boolean);

export default {
  ...base,
  server: {
    ...base.server,
    host: '0.0.0.0',
    allowedHosts: allowedHosts?.length ? allowedHosts : undefined,
  },
};
