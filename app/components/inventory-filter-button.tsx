/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { ComponentProps } from "react";

const styles = `
.filter-button {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  border-radius: 6px;
  color: #a0a0c0;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.filter-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.1), transparent);
  transition: left 0.5s ease;
}

.filter-button:hover::before {
  left: 100%;
}

.filter-button:hover {
  background: linear-gradient(145deg, rgba(30, 30, 47, 0.8) 0%, rgba(42, 42, 58, 0.6) 100%);
  border-color: rgba(58, 134, 255, 0.4);
  color: #e2e2f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-button.active {
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.2) 0%, rgba(58, 134, 255, 0.1) 100%);
  border-color: rgba(58, 134, 255, 0.6);
  color: #3a86ff;
  box-shadow: 
    0 0 20px rgba(58, 134, 255, 0.15),
    inset 0 0 20px rgba(58, 134, 255, 0.05);
}

.filter-button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  border-radius: 1px;
}

.filter-button-text {
  position: relative;
  z-index: 1;
}

.filter-button-text.shadow {
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
}
`;

export function InventoryFilterButton({
  active,
  children,
  shadowless,
  ...props
}: ComponentProps<"button"> & {
  active?: boolean;
  shadowless?: boolean;
}) {
  return (
    <>
      <style>{styles}</style>
      <button
        {...props}
        className={clsx(
          "filter-button",
          active && "active"
        )}
      >
        <span
          className={clsx(
            "filter-button-text",
            !active && !shadowless && "shadow"
          )}
        >
          {children}
        </span>
      </button>
    </>
  );
}