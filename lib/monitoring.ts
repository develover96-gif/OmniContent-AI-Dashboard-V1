
/**
 * Simple Monitoring Service
 * In a real production environment, this would bridge to Sentry, PostHog, or LogRocket.
 */

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, properties);
  // Example: window.posthog?.capture(eventName, properties);
};

export const trackError = (error: Error, context?: string) => {
  console.error(`[Error Tracking] ${context || 'App Error'}:`, error);
  // Example: Sentry.captureException(error);
};

export const initMonitoring = () => {
  console.log('[System] Monitoring initialized for production readiness.');
  
  // Track basic page view on load
  trackEvent('app_initialized', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  });

  // Catch unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'Unhandled Promise Rejection');
  });
};
