/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { EconomyItemFilter } from "~/utils/economy-filters";
import { useTranslate } from "./app-context";
import { ItemPickerFilterIcon } from "./item-picker-filter-icon";
import { TextSlider } from "./text-slider";

const styles = `
.filter-desktop-container {
  display: flex;
  max-width: 220px;
  min-width: 168px;
}

.filter-list {
  width: 100%;
  border-radius: 6px;
  background: linear-gradient(145deg, rgba(15, 15, 25, 0.6) 0%, rgba(21, 21, 32, 0.4) 100%);
  padding-bottom: 0.375rem;
  border: 1px solid rgba(42, 42, 58, 0.4);
}

.filter-button {
  position: relative;
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  overflow: hidden;
  padding: 0.5rem 1rem 0.5rem 2rem;
  text-align: left;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: none;
  margin: 0.125rem;
  border-radius: 4px;
}

.filter-button.idle {
  color: #6c6c8a;
}

.filter-button.idle:hover {
  background: rgba(58, 134, 255, 0.1);
  color: #a0a0c0;
  transform: translateX(2px);
}

.filter-button.active {
  background: linear-gradient(135deg, rgba(58, 134, 255, 0.2) 0%, rgba(131, 56, 236, 0.15) 100%);
  color: #3a86ff;
  box-shadow: 0 2px 8px rgba(58, 134, 255, 0.2);
  border: 1px solid rgba(58, 134, 255, 0.3);
}

.filter-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  height: 1rem;
  transform: translateY(-50%) rotate(-12deg);
  opacity: 0.2;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 3px rgba(58, 134, 255, 0.3));
}

.filter-icon.active {
  transform: translateY(-50%) rotate(-12deg) scale(1.3);
  opacity: 0.4;
}

.filter-icon.idle {
  transform: translateY(-50%) rotate(-12deg) scale(1.1);
  opacity: 0.15;
}

.filter-text {
  font-family: 'Rajdhani', sans-serif;
  min-width: 0;
  flex: 1;
  font-weight: 700;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  font-size: 0.875rem;
}
`;

export function ItemPickerFilterDesktop({
  categories,
  onChange,
  value
}: {
  categories: EconomyItemFilter[];
  onChange: (newValue: EconomyItemFilter) => void;
  value: EconomyItemFilter;
}) {
  const translate = useTranslate();

  function handleClick(filter: EconomyItemFilter) {
    return function handleClick() {
      onChange(filter);
    };
  }

  return (
    <>
      <style>{styles}</style>
      <div className="filter-desktop-container">
        <div className="filter-list">
          {categories.map((filter, index) => {
            const isActive =
              filter.category === value.category && filter.type === value.type;
            const isIdle = !isActive;
            return (
              <button
                className={clsx(
                  "filter-button",
                  isIdle && "idle",
                  isActive && "active"
                )}
                key={index}
                onClick={handleClick(filter)}
              >
                <ItemPickerFilterIcon
                  icon={filter.icon}
                  className={clsx(
                    "filter-icon",
                    isActive ? "active" : "idle"
                  )}
                />
                <div className="filter-text">
                  <TextSlider text={translate(`Category${filter.label}`)} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}