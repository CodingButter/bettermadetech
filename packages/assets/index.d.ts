declare module '@repo/assets' {
  /** Icon sizes by category */
  export interface IconSizes {
    extension: number[];
    webapp: number[];
    social: number[];
  }
  
  /** Extension icon paths */
  export interface ExtensionIconPaths {
    icon16: string;
    icon32: string;
    icon48: string;
    icon128: string;
  }
  
  /** Web application icon paths */
  export interface WebappIconPaths {
    icon32: string;
    icon64: string;
    icon128: string;
    icon192: string;
    icon256: string;
    icon512: string;
  }
  
  /** Social media icon paths */
  export interface SocialIconPaths {
    icon200: string;
    icon400: string;
    icon600: string;
    icon800: string;
    icon1200: string;
  }
  
  /** All logo-related asset paths */
  export interface LogoPaths {
    original: string;
    extension: ExtensionIconPaths;
    webapp: WebappIconPaths;
    social: SocialIconPaths;
  }
  
  /** Favicon-related paths */
  export interface FaviconPaths {
    ico: string;
    manifest: string;
    webmanifest: string;
    /** Returns HTML code for including favicons in a web page */
    getHtmlCode(): Promise<string>;
  }
  
  /** Asset directory paths */
  export interface DirectoryPaths {
    images: string;
    icons: string;
    favicons: string;
  }
  
  /** Icon sizes for each category */
  export const sizes: IconSizes;
  
  /** Logo and icon file paths */
  export const logo: LogoPaths;
  
  /** Favicon file paths */
  export const favicon: FaviconPaths;
  
  /** Directory paths for different asset types */
  export const directories: DirectoryPaths;
}