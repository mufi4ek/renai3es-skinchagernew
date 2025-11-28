/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { ComponentProps } from "react";

const styles = `
.context-button {
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  color: #e2e2f0;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  background: transparent;
  border: none;
  cursor: pointer;
}

.context-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.1), transparent);
  transition: left 0.3s ease;
}

.context-button:hover::before {
  left: 100%;
}

.context-button:hover {
  background: rgba(58, 134, 255, 0.1);
  color: #3a86ff;
}

.context-button:active {
  background: rgba(58, 134, 255, 0.15);
  transform: translateX(2px);
}

.context-button.success {
  color: #10b981;
}

.context-button.success:hover {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
}
`;

export function ContextButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <>
      <style>{styles}</style>
      <button className={clsx("context-button", className)} {...props} />
    </>
  );
}
