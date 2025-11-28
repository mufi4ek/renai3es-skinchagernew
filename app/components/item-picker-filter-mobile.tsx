/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import clsx from "clsx";
import { EconomyItemFilter } from "~/utils/economy-filters";
import { useTranslate } from "./app-context";

const styles = `
.filter-mobile-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

.filter-mobile-button {
  font-family: 'Rajdhani', sans-serif;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(42, 42, 58, 0.6);
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  color: #a0a0c0;
  position: relative;
  overflow: hidden;
}

.filter-mobile-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.1), transparent);
  transition: left 0.3s ease;
}

.filter-mobile-button:hover::before {
  left: 100%;
}

.filter-mobile-button:hover {
  background: linear-gradient(145deg, rgba(30, 30, 47, 0.8) 0%, rgba(42, 42, 58, 0.6) 100%);
  border-color: rgba(58, 134, 255, 0.4);
  color: #e2e2f0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.filter-mobile-button.active {
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.2) 0%, rgba(131, 56, 236, 0.15) 100%);
  border-color: rgba(58, 134, 255, 0.6);
  color: #3a86ff;
  box-shadow: 
    0 0 20px rgba(58, 134, 255, 0.15),
    inset 0 0 20px rgba(58, 134, 255, 0.05);
}

.filter-mobile-button.active::after {
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
`;

export function ItemPickerFilterMobile({
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
      <div className="filter-mobile-container">
        {categories.map((filter, index) => {
          const isActive = filter.category === value.category && filter.type === value.type;
          return (
            <button
              key={index}
              className={clsx(
                "filter-mobile-button",
                isActive && "active"
              )}
              onClick={handleClick(filter)}
            >
              {translate(`Category${filter.label}`)}
            </button>
          );
        })}
      </div>
    </>
  );
}