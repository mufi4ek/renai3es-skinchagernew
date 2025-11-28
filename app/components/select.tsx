/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useClickAway } from "@uidotdev/usehooks";
import clsx from "clsx";
import { ReactNode, useState } from "react";

const styles = `
.select-container {
  position: relative;
}

.select-button {
  display: flex;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border: 1px solid #2a2a3a;
  color: #e2e2f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.select-button:hover {
  background: linear-gradient(145deg, rgba(26, 26, 38, 0.9) 0%, rgba(35, 35, 52, 0.7) 100%);
  border-color: #3a3a5a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.select-button:focus {
  outline: none;
  border-color: #3a86ff;
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2), 0 4px 12px rgba(0, 0, 0, 0.4);
}

.select-button-open {
  border-bottom-color: transparent !important;
}

.select-button-open-up {
  border-top-color: transparent !important;
  border-bottom-color: #2a2a3a !important;
}

.select-content {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 0.5rem;
}

.select-icon {
  color: #a0a0c0;
  transition: transform 0.3s ease;
}

.select-button:hover .select-icon {
  color: #3a86ff;
}

.select-dropdown {
  position: absolute;
  left: 0;
  z-index: 50;
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.select-dropdown-up {
  bottom: 100%;
  border-radius: 8px 8px 0 0;
}

.select-dropdown-down {
  top: 100%;
  border-radius: 0 0 8px 8px;
}

.select-option {
  display: flex;
  width: 100%;
  cursor: default;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
  border-bottom: 1px solid rgba(42, 42, 58, 0.3);
}

.select-option:last-child {
  border-bottom: none;
}

.select-option:hover {
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.15) 0%, rgba(58, 134, 255, 0.1) 100%);
  color: #3a86ff;
}

.select-option-selected {
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.25) 0%, rgba(58, 134, 255, 0.2) 100%);
  color: #3a86ff;
}

.select-option-selected-grayscale {
  background: rgba(42, 42, 58, 0.6);
  color: #e2e2f0;
}

.select-option-grayscale:hover {
  background: rgba(42, 42, 58, 0.8);
  color: #a0a0c0;
}

.select-scrollable {
  max-height: 128px;
  overflow-y: auto;
}

/* Custom scrollbar for select dropdown */
.select-scrollable::-webkit-scrollbar {
  width: 6px;
}

.select-scrollable::-webkit-scrollbar-track {
  background: rgba(21, 21, 32, 0.5);
  border-radius: 3px;
}

.select-scrollable::-webkit-scrollbar-thumb {
  background: rgba(58, 134, 255, 0.3);
  border-radius: 3px;
}

.select-scrollable::-webkit-scrollbar-thumb:hover {
  background: rgba(58, 134, 255, 0.5);
}
`;

export function Select<T extends { value: string }>({
  children,
  className,
  direction,
  grayscale,
  noMaxHeight,
  onChange,
  options,
  optionsStyles,
  value
}: {
  children?: (option: T) => ReactNode;
  className?: string;
  direction?: "up" | "down";
  grayscale?: boolean;
  noMaxHeight?: boolean;
  onChange: (value: string) => void;
  options: T[];
  optionsStyles?: string;
  value: string;
}) {
  children ??= ({ value }) => value;
  direction ??= "down";
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickAway(() => {
    setIsOpen(false);
  });
  const selected = options.find((option) => option.value === value)!;

  return (
    <>
      <style>{styles}</style>
      <div className="select-container">
        <button
          className={clsx(
            "select-button",
            isOpen
              ? direction === "down"
                ? "select-button-open rounded-t-lg"
                : "select-button-open-up rounded-b-lg"
              : "rounded-lg",
            className ?? "min-w-[253px] px-3 py-2"
          )}
          onClick={() => setIsOpen(true)}
        >
          <div className="select-content">
            {children(selected)}
          </div>
          <FontAwesomeIcon 
            icon={faCaretDown} 
            className={clsx(
              "select-icon h-4 transition-transform",
              isOpen && "rotate-180"
            )} 
          />
        </button>
        {isOpen && (
          <div
            className={clsx(
              "select-dropdown",
              direction === "up" ? "select-dropdown-up" : "select-dropdown-down",
              className ?? "min-w-[253px]",
              !noMaxHeight && "select-scrollable",
              optionsStyles
            )}
            ref={ref as any}
          >
            {options.map((option) => {
              const isSelected = value === option.value;
              return (
                <button
                  key={option.value}
                  className={clsx(
                    "select-option",
                    isSelected
                      ? grayscale
                        ? "select-option-selected-grayscale"
                        : "select-option-selected"
                      : grayscale
                        ? "select-option-grayscale"
                        : ""
                  )}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {children !== undefined && children(option)}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}