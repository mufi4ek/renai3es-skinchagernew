/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { useTranslate } from "./app-context";
import { Logo } from "./logo";

const styles = `
.splash-container {
  align-items: center;
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  color: #e2e2f0;
  display: flex;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  z-index: 100;
}

.splash-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(131, 56, 236, 0.08) 0%, transparent 50%);
  pointer-events: none;
}

.splash-content {
  border: 1px solid rgba(42, 42, 58, 0.8);
  border-radius: 12px;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.95) 0%, rgba(30, 30, 47, 0.9) 100%);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(58, 134, 255, 0.1);
  min-width: 240px;
  min-height: 48px;
  position: relative;
  overflow: hidden;
}

.splash-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.splash-logo-container {
  padding: 0.75rem 1rem 0 1rem;
}

.splash-logo {
  margin: auto;
  height: 2.5rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
}

.splash-progress-container {
  background: rgba(26, 26, 38, 0.6);
  border-radius: 4px;
  margin: 1rem 0.75rem 0.75rem 0.75rem;
  overflow: hidden;
  padding: 2px;
  border: 1px solid rgba(42, 42, 58, 0.4);
}

.splash-progress-bar {
  background: linear-gradient(90deg, #3a86ff, #8338ec);
  border-radius: 2px;
  height: 4px;
  transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
  width: 0%;
  box-shadow: 0 0 8px rgba(58, 134, 255, 0.4);
}

.splash-noscript {
  padding: 0 0.5rem 0.5rem 0.5rem;
  text-align: center;
}

.splash-noscript strong {
  color: #ff6b6b;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}
`;

export function Splash() {
  const translate = useTranslate();
  return (
    <div
      id="splash"
      suppressHydrationWarning
      className="splash-container"
    >
      <div
        suppressHydrationWarning
        className="splash-content"
      >
        <div
          suppressHydrationWarning
          className="splash-logo-container"
        >
          <Logo
            className="splash-logo"
          />
        </div>
        <div
          className="splash-progress-container"
        >
          <div
            suppressHydrationWarning
            id="splash-progress"
            className="splash-progress-bar"
          />
        </div>
        <noscript>
          <div className="splash-noscript">
            <strong>{translate("JavaScriptRequired")}</strong>
          </div>
        </noscript>
      </div>
      <style
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `${styles}\n:root {color-scheme: dark;}`
        }}
      />
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: __SPLASH_SCRIPT__
        }}
      />
    </div>
  );
}