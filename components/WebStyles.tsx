import { Platform } from 'react-native';

/**
 * Component that injects web-specific CSS for mobile viewport styling
 * Only runs on web platform
 * Injects styles synchronously to prevent flash
 */
export default function WebStyles() {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // Inject styles synchronously before React renders
    if (!document.getElementById('moodmeal-mobile-styles')) {
      const style = document.createElement('style');
      style.id = 'moodmeal-mobile-styles';
      style.textContent = `
        * { 
          box-sizing: border-box; 
          -webkit-tap-highlight-color: transparent;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #FFF4E9;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        #root {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFF4E9;
        }
        #moodmeal-container {
          width: 100%;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #FFF4E9;
          overflow: hidden;
        }
        #moodmeal-wrapper {
          width: min(414px, 100%);
          height: min(896px, 100vh);
          background-color: #FFF4E9;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.15);
          overflow: auto;
          position: relative;
          border-radius: 0;
        }
        * { 
          touch-action: manipulation; 
        }
        button, a, [role="button"] {
          cursor: pointer;
        }
        input, textarea {
          -webkit-user-select: text;
          -moz-user-select: text;
          user-select: text;
        }
        /* Constrain modals to mobile viewport - target React Native Modal root */
        body > div[role="presentation"],
        body > div[style*="position: fixed"] {
          max-width: min(414px, 100vw) !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          margin: 0 auto !important;
        }
        /* Ensure modal content fits mobile viewport */
        [data-testid="modal-content"] {
          max-width: 100% !important;
        }
      `;
      // Insert at the beginning of head to ensure it loads first
      if (document.head.firstChild) {
        document.head.insertBefore(style, document.head.firstChild);
      } else {
        document.head.appendChild(style);
      }
    }
  }

  return null;
}

