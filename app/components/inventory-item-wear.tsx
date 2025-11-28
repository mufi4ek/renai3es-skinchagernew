/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { wearToString } from "~/utils/economy";
import { useTranslate } from "./app-context";

const styles = `
.wear-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wear-label {
  color: #a0a0c0;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.wear-value {
  color: #e2e2f0;
  font-weight: 500;
}

.wear-bar-container {
  position: relative;
  height: 4px;
  width: 128px;
  background: linear-gradient(
    90deg,
    #3b818f 0%,
    #3b818f 7%,
    #83b135 7%,
    #83b135 15%,
    #d7be47 15%,
    #d7be47 38%,
    #f08140 38%,
    #f08140 45%,
    #ec4f3d 45%,
    #ec4f3d 100%
  );
  border-radius: 2px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
}

.wear-bar-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  border-radius: 2px;
}

.wear-indicator {
  position: absolute;
  top: -2px;
  height: 8px;
  width: 2px;
  background: #ffffff;
  box-shadow: 
    0 0 4px rgba(255, 255, 255, 0.8),
    0 0 8px rgba(58, 134, 255, 0.5);
  border-radius: 1px;
  z-index: 2;
  transition: all 0.3s ease;
}

.wear-indicator::after {
  content: '';
  position: absolute;
  top: 0;
  left: -1px;
  right: -1px;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
  border-radius: 1px;
}
`;

export function InventoryItemTooltipWear({ wear }: { wear: number }) {
  const translate = useTranslate();
  const left = `${wear * 100}%`;

  return (
    <>
      <style>{styles}</style>
      <div className="wear-container">
        <div>
          <span className="wear-label">
            {translate("InventoryItemWear")}
          </span>{" "}
          <span className="wear-value">
            {wearToString(wear)}
          </span>
        </div>
        <div className="wear-bar-container">
          <div
            className="wear-indicator"
            style={{ left }}
          />
        </div>
      </div>
    </>
  );
}