// This script injects mobile viewport styles before React loads
// It's executed in the HTML head to prevent flash

if (typeof document !== 'undefined' && !document.getElementById('dietello-mobile-styles')) {
  const style = document.createElement('style');
  style.id = 'dietello-mobile-styles';
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
    /* iPhone 11 mobile wrapper styles - 414x896 */
    .dietello-mobile-container {
      width: 100% !important;
      height: 100vh !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      background-color: #FFF4E9 !important;
      overflow: hidden !important;
    }
    .dietello-mobile-wrapper {
      width: 414px !important;
      height: 896px !important;
      max-width: 100% !important;
      max-height: 100vh !important;
      background-color: #FFF4E9 !important;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.15) !important;
      overflow: auto !important;
      position: relative !important;
      border-radius: 0 !important;
    }
    @media (max-width: 414px) {
      .dietello-mobile-wrapper {
        width: 100% !important;
        height: 100vh !important;
        box-shadow: none !important;
      }
    }
    @media (max-height: 896px) {
      .dietello-mobile-wrapper {
        height: 100vh !important;
      }
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
  `;
  if (document.head.firstChild) {
    document.head.insertBefore(style, document.head.firstChild);
  } else {
    document.head.appendChild(style);
  }
}





