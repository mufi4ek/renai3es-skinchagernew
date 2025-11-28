/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ComponentProps } from "react";
import { ButtonWithTooltip } from "./button-with-tooltip";

const styles = `
.tool-button {
  cursor: default;
  padding: 0.375rem;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border-radius: 6px;
  color: #a0a0c0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tool-button:hover:not(:disabled) {
  background: linear-gradient(145deg, rgba(26, 26, 38, 0.9) 0%, rgba(35, 35, 52, 0.7) 100%);
  color: #3a86ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.tool-button:active:not(:disabled) {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.tool-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.tool-button-bordered {
  border: 1px solid rgba(42, 42, 58, 0.8);
}

.tool-button-bordered:hover:not(:disabled) {
  border-color: rgba(58, 134, 255, 0.5);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(58, 134, 255, 0.2);
}

.tool-button-icon {
  height: 1rem;
  transition: color 0.3s ease;
}
`;

export function ToolButton({
  icon,
  isBorderless,
  ...props
}: ComponentProps<typeof ButtonWithTooltip> & {
  icon: IconProp;
  isBorderless?: boolean;
}) {
  return (
    <>
      <style>{styles}</style>
      <ButtonWithTooltip
        {...props}
        className={clsx(
          "tool-button",
          !isBorderless && "tool-button-bordered"
        )}
      >
        <FontAwesomeIcon className="tool-button-icon" icon={icon} />
      </ButtonWithTooltip>
    </>
  );
}