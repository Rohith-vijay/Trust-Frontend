/**
 * Mock/Placeholder Sentry service for the React client.
 * Includes client-side PII scrubbing in the beforeSend hook equivalent.
 */
class SentryPlaceholderService {
  constructor() {
    this.dsn = "https://mock-sentry-dsn@sentry.io/123";
    console.log("[SENTRY-MOCK] Initialized client-side Sentry error tracking with PII scrubbing.");
  }

  // Client-side before_send PII scrubbing implementation
  beforeSend(event) {
    let message = event.message || "";
    // Mask Indian PAN and Email Addresses
    const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]/gi;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    message = message.replace(panRegex, "[REDACTED_PAN]").replace(emailRegex, "[REDACTED_EMAIL]");
    event.message = message;
    return event;
  }

  captureException(error) {
    const errorEvent = {
      message: error.message || error.toString(),
      stack: error.stack
    };
    const scrubbedEvent = this.beforeSend(errorEvent);
    console.warn(`[SENTRY-MOCK] Exception captured: ${scrubbedEvent.message}`, errorEvent.stack);
  }
}

export const Sentry = new SentryPlaceholderService();
