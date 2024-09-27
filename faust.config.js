// faust.config.js
import { config as coreConfig } from '@faustwp/core';

export default coreConfig({
  wpUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
  apiClientSecret: process.env.FAUST_SECRET_KEY,
  revalidate: {
    maxAge: 60,
  },
});