/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CS2EconomyItem } from "@ianlucas/cs2-lib";
import { useItemPickerState } from "~/components/hooks/use-item-picker-state";
import { ItemBrowser } from "~/components/item-browser";
import { ItemPickerFilterMobile } from "~/components/item-picker-filter-mobile";
import { useTranslate } from "./app-context";

const styles = `
.item-picker-mobile {
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 25, 0.9) 100%);
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 58, 0.8);
  backdrop-filter: blur(10px);
  margin: 0.5rem;
}

.search-container {
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
}

.search-icon {
  color: #6c6c8a;
  transition: color 0.3s ease;
}

.search-input {
  flex: 1;
  border-radius: 6px;
  background: rgba(15, 15, 25, 0.6);
  border: 1px solid rgba(42, 42, 58, 0.6);
  padding: 0.75rem 1rem;
  color: #e2e2f0;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #3a86ff;
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
  background: rgba(15, 15, 25, 0.8);
}

.search-input::placeholder {
  color: #6c6c8a;
}

.search-container:focus-within .search-icon {
  color: #3a86ff;
}

.browser-container {
  padding: 0.25rem 0 0.5rem 0;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border-radius: 6px;
  margin: 0 0.5rem;
  border: 1px solid rgba(42, 42, 58, 0.4);
}
`;

export function ItemPickerMobile({
  onPickItem
}: {
  onPickItem: (item: CS2EconomyItem) => void;
}) {
  const {
    categories,
    filter,
    handleCategoryClick,
    handleItemClick,
    ignoreRarityColor,
    items,
    query,
    setQuery
  } = useItemPickerState({ onPickItem });
  const translate = useTranslate();

  return (
    <>
      <style>{styles}</style>
      <div className="item-picker-mobile">
        <ItemPickerFilterMobile
          categories={categories}
          onChange={handleCategoryClick}
          value={filter}
        />
        <div className="search-container">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="search-icon h-4"
          />
          <input
            value={query}
            onChange={setQuery}
            className="search-input"
            placeholder={translate("CraftSearchPlaceholder")}
          />
        </div>
        <div className="browser-container">
          <ItemBrowser
            items={items}
            onClick={handleItemClick}
            ignoreRarityColor={ignoreRarityColor}
          />
        </div>
      </div>
    </>
  );
}