import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://6dbb91b7a66cb572becc21b760e98257@o4510714371440640.ingest.de.sentry.io/4510714378125392",

  enableLogs: true,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: process.env.NODE_ENV === 'development',

});