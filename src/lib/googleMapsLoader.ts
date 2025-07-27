/**
 * Google Maps API Loader Singleton
 * Prevents duplicate script loading and provides centralized loading management
 */

interface GoogleMapsLoaderOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
}

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader;
  private loadPromise: Promise<typeof google> | null = null;
  private isLoaded = false;
  private isLoading = false;

  private constructor() {}

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader();
    }
    return GoogleMapsLoader.instance;
  }

  public async load(options: GoogleMapsLoaderOptions): Promise<typeof google> {
    // Return immediately if already loaded
    if (this.isLoaded && window.google && window.google.maps) {
      return window.google;
    }

    // Return existing promise if currently loading
    if (this.isLoading && this.loadPromise) {
      return this.loadPromise;
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript && window.google && window.google.maps) {
      this.isLoaded = true;
      return window.google;
    }

    // Start loading
    this.isLoading = true;
    this.loadPromise = this.loadScript(options);

    try {
      const google = await this.loadPromise;
      this.isLoaded = true;
      this.isLoading = false;
      return google;
    } catch (error) {
      this.isLoading = false;
      this.loadPromise = null;
      throw error;
    }
  }

  private loadScript(options: GoogleMapsLoaderOptions): Promise<typeof google> {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.google && window.google.maps) {
        resolve(window.google);
        return;
      }

      // Create unique callback name
      const callbackName = `googleMapsCallback_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

      // Build URL with parameters
      const params = new URLSearchParams({
        key: options.apiKey,
        loading: 'async',
        callback: callbackName,
      });

      if (options.libraries && options.libraries.length > 0) {
        params.append('libraries', options.libraries.join(','));
      }

      if (options.language) {
        params.append('language', options.language);
      }

      if (options.region) {
        params.append('region', options.region);
      }

      const scriptUrl = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      // Create script element
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      script.setAttribute('data-callback', callbackName);
      script.setAttribute('data-loader', 'singleton');

      // Set up global callback
      (window as any)[callbackName] = () => {
        console.log('Google Maps API loaded successfully via singleton loader');
        delete (window as any)[callbackName];
        
        if (window.google && window.google.maps) {
          resolve(window.google);
        } else {
          reject(new Error('Google Maps API failed to initialize properly'));
        }
      };

      // Handle script loading errors
      script.onerror = (event) => {
        console.error('Failed to load Google Maps script:', event);
        delete (window as any)[callbackName];
        document.head.removeChild(script);
        reject(new Error('Failed to load Google Maps API script'));
      };

      // Add timeout for loading
      const timeoutId = setTimeout(() => {
        delete (window as any)[callbackName];
        if (script.parentNode) {
          document.head.removeChild(script);
        }
        reject(new Error('Google Maps API loading timeout'));
      }, 20000);

      // Clear timeout when script loads
      script.onload = () => {
        clearTimeout(timeoutId);
      };

      // Add script to document
      document.head.appendChild(script);
    });
  }

  public isGoogleMapsLoaded(): boolean {
    return this.isLoaded && !!(window.google && window.google.maps);
  }

  public getLoadingStatus(): { isLoaded: boolean; isLoading: boolean } {
    return {
      isLoaded: this.isLoaded,
      isLoading: this.isLoading,
    };
  }
}

// Export singleton instance
export const googleMapsLoader = GoogleMapsLoader.getInstance();

// Export types
export type { GoogleMapsLoaderOptions };
