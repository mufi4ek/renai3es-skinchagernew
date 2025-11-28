/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { ComponentProps } from "react";

const styles = `
.tool-input {
  font-family: 'Rajdhani', sans-serif;
  letter-spacing: 0.1em;
  outline: none;
  border: 1px solid rgba(42, 42, 58, 0.8);
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.9) 0%, rgba(30, 30, 47, 0.7) 100%);
  color: #e2e2f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tool-input::placeholder {
  font-family: sans-serif;
  letter-spacing: normal;
  color: #6b6b8a;
}

.tool-input:focus {
  border-color: rgba(58, 134, 255, 0.6);
  box-shadow: 
    0 0 0 2px rgba(58, 134, 255, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.4);
  background: linear-gradient(145deg, rgba(26, 26, 38, 0.95) 0%, rgba(35, 35, 52, 0.8) 100%);
}

.tool-input:disabled {
  background: transparent;
  padding-left: 0;
  padding-right: 0;
  color: #e2e2f0;
  opacity: 0.7;
  cursor: not-allowed;
}

.tool-input-flexible {
  width: 0;
  min-width: 0;
  flex: 1;
}

.tool-input-styled {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
}

.tool-input-invalid {
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 100%);
  border-color: rgba(239, 68, 68, 0.5);
  color: #fecaca;
}

.tool-input-invalid:focus {
  border-color: rgba(239, 68, 68, 0.7);
  box-shadow: 
    0 0 0 2px rgba(239, 68, 68, 0.2),
    0 4px 12px rgba(0, 0, 0, 0.4);
}

.tool-input-unstyled {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
}

.tool-input-unstyled:focus {
  background: transparent;
  border: none;
  box-shadow: none;
}
`;

export function ToolInput({
  inflexible,
  pattern,
  unstyled,
  validate,
  ...props
}: Omit<ComponentProps<"input">, "pattern" | "value"> & {
  inflexible?: boolean;
  pattern?: RegExp;
  unstyled?: boolean;
  validate?: (value?: string) => boolean;
  value?: string;
}) {
  const invalid =
    (pattern !== undefined &&
      typeof props.value === "string" &&
      props.value !== "" &&
      pattern.exec(props.value.trim()) === null) ||
    (validate !== undefined && !validate(props.value));

  return (
    <>
      <style>{styles}</style>
      <input
        {...props}
        className={clsx(
          "tool-input",
          !inflexible && "tool-input-flexible",
          !unstyled && "tool-input-styled",
          invalid
            ? "tool-input-invalid"
            : unstyled
              ? "tool-input-unstyled"
              : "",
          props.className
        )}
      />
    </>
  );
}