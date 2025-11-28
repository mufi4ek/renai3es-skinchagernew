/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { CS2EconomyItem } from "@ianlucas/cs2-lib";
import { useItemPickerState } from "~/components/hooks/use-item-picker-state";
import { ItemBrowser } from "~/components/item-browser";
import { useTranslate } from "./app-context";
import { IconInput } from "./icon-input";
import { ItemPickerFilterDesktop } from "./item-picker-filter-desktop";

const styles = `
.item-picker-desktop {
  padding-bottom: 0.5rem;
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 25, 0.9) 100%);
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 58, 0.8);
  backdrop-filter: blur(10px);
}

.picker-container {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.75rem;
  padding: 0 0.75rem;
}

.filter-section {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border-radius: 6px;
  border: 1px solid rgba(42, 42, 58, 0.6);
  padding: 0.75rem;
  min-width: 200px;
}

.search-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search-input-container {
  margin-bottom: 0.5rem;
}

.browser-container {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border-radius: 6px;
  border: 1px solid rgba(42, 42, 58, 0.6);
  padding: 0.5rem;
  flex: 1;
}
`;

export function ItemPickerDesktop({
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
      <div className="item-picker-desktop">
        <div className="picker-container">
          <div className="filter-section">
            <ItemPickerFilterDesktop
              categories={categories}
              onChange={handleCategoryClick}
              value={filter}
            />
          </div>
          <div className="search-section">
            <div className="search-input-container">
              <IconInput
                icon={faMagnifyingGlass}
                labelStyles="mb-2"
                onChange={setQuery}
                placeholder={translate("CraftSearchPlaceholder")}
                value={query}
              />
            </div>
            <div className="browser-container">
              <ItemBrowser
                ignoreRarityColor={ignoreRarityColor}
                items={items}
                maxItemsIntoView={8}
                onClick={handleItemClick}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}