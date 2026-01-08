/**
 * Type definitions for Rankify constants and configurations
 */

// Feature Service Type
export interface FeatureService {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  href: string;
  active: boolean;
}

// Site Configuration Type
export interface SiteConfig {
  domain: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  social: {
    twitter: string;
    github: string;
    discord: string;
    linkedin: string;
  };
  email: {
    support: string;
    contact: string;
    hello: string;
  };
  urls: {
    app: string;
    docs: string;
    blog: string;
  };
}

// Color System Type
export interface ColorSystem {
  primary: {
    emerald: string;
    cyan: string;
    coral: string;
    pink: string;
  };
  background: {
    black: string;
    zinc: {
      900: string;
      800: string;
      700: string;
    };
  };
  text: {
    white: string;
    slate: {
      300: string;
      400: string;
      500: string;
    };
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Navigation Routes Type
export interface NavigationRoutes {
  home: string;
  websiteAudit: string;
  pricing: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  cookies: string;
  security: string;
}
