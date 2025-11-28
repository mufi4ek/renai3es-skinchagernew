/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ClientOnly } from "remix-utils/client-only";
import { didUserAuthenticateInThisBrowser } from "~/utils/user-cached-data";
import { useTranslate, useUser } from "./app-context";

const styles = `
.sync-warn-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 100%);
  border: 1px solid rgba(239, 68, 68, 0.4);
  backdrop-filter: blur(10px);
  padding: 0.75rem 1rem;
  color: #fecaca;
  font-size: 0.875rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  user-select: none;
  position: relative;
  overflow: hidden;
}

.sync-warn-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent);
}

.sync-warn-icon {
  color: #f87171;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  animation: pulse-warn 2s infinite;
}

@keyframes pulse-warn {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.sync-warn-text {
  color: #fecaca;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (min-width: 1024px) {
  .sync-warn-container {
    gap: 0.5rem;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    font-weight: 700;
  }
}
`;

export function SyncWarn() {
  const user = useUser();
  const translate = useTranslate();

  return (
    <ClientOnly
      children={() =>
        user === undefined && didUserAuthenticateInThisBrowser() ? (
          <>
            <style>{styles}</style>
            <div className="sync-warn-container">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="sync-warn-icon h-4" 
              />
              <span className="sync-warn-text">
                {translate("SyncWarnText")}
              </span>
            </div>
          </>
        ) : null
      }
    />
  );
}