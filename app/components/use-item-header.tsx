/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { InfoIcon } from "./info-icon";

const styles = `
.use-item-header {
  text-align: center;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  padding: 1rem 0;
  position: relative;
}

.use-item-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.5;
}

.use-item-header-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.875rem;
  line-height: 2.5rem;
  font-weight: 600;
  color: #e2e2f0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.use-item-header-action {
  font-size: 1.125rem;
  color: #a0a0c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.5rem;
}

.use-item-header-action strong {
  color: #e2e2f0;
  background: linear-gradient(135deg, #3a86ff, #8338ec);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.use-item-header-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #a0a0c0;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 58, 0.6);
  backdrop-filter: blur(10px);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.use-item-header-warning strong {
  color: #ff6b6b;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.use-item-header-info-icon {
  color: #3a86ff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .use-item-header-title {
    font-size: 1.5rem;
    line-height: 2rem;
  }
  
  .use-item-header-action {
    font-size: 1rem;
  }
  
  .use-item-header-warning {
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
  }
}
`;

export function UseItemHeader({
  actionDesc,
  actionItem,
  title,
  warning,
  warningItem
}: {
  actionDesc?: string;
  actionItem?: string;
  title: string;
  warning: string;
  warningItem?: string;
}) {
  return (
    <>
      <style>{styles}</style>
      <div className="use-item-header">
        <div className="use-item-header-title">
          {title}
        </div>
        {actionDesc !== undefined && (
          <div className="use-item-header-action">
            {actionDesc}{" "}
            {actionItem !== undefined && <strong>{actionItem}</strong>}
          </div>
        )}
        <div className="use-item-header-warning">
          <InfoIcon className="use-item-header-info-icon h-4" />
          <span>{warning}</span>
          {warningItem !== undefined && <strong>{warningItem}</strong>}
        </div>
      </div>
    </>
  );
}