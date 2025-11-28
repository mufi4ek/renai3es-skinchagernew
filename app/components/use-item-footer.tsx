/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { ReactNode } from "react";

const styles = `
.use-item-footer {
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  min-height: 63px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(42, 42, 58, 0.8);
  padding-top: 0.375rem;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
  background: linear-gradient(180deg, 
    transparent 0%, 
    rgba(21, 21, 32, 0.3) 100%);
  backdrop-filter: blur(10px);
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;
}

.use-item-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.3), transparent);
}

.use-item-footer-default {
  max-width: 1024px;
}

@media (min-width: 1024px) {
  .use-item-footer-default {
    width: 1024px;
  }
}

.use-item-footer-left {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.use-item-footer-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  flex-wrap: wrap;
  row-gap: 0.25rem;
  font-size: 1.125rem;
}

.use-item-footer-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.use-item-footer-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(58, 134, 255, 0.2), 
    rgba(131, 56, 236, 0.2), 
    transparent
  );
  opacity: 0.7;
}
`;

export function UseItemFooter({
  className,
  left,
  right
}: {
  className?: string;
  left?: ReactNode;
  right: ReactNode;
}) {
  return (
    <>
      <style>{styles}</style>
      <div
        className={clsx(
          "use-item-footer",
          !className && "use-item-footer-default",
          className
        )}
      >
        <div className="use-item-footer-gradient" />
        <div className="use-item-footer-left">
          {left}
        </div>
        <div className="use-item-footer-right">
          <div className="use-item-footer-buttons">
            {right}
          </div>
        </div>
      </div>
    </>
  );
}