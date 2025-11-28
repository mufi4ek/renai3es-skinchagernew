/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2EconomyItem } from "@ianlucas/cs2-lib";
import { GridList } from "./grid-list";
import { ItemButton } from "./item-button";

const styles = `
.item-browser-container {
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 25, 0.95) 100%);
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 58, 0.8);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
}

.item-browser-grid {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border-radius: 6px;
  margin: 2px;
}

.item-browser-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 4px;
  margin: 1px;
}

.item-browser-item:hover {
  background: rgba(58, 134, 255, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(58, 134, 255, 0.2);
}

.item-browser-item:active {
  transform: translateY(0);
}
`;

export function ItemBrowser({
  ignoreRarityColor,
  items,
  maxItemsIntoView = 6,
  onClick
}: {
  ignoreRarityColor?: boolean;
  items: CS2EconomyItem[];
  maxItemsIntoView?: number;
  onClick?: (item: CS2EconomyItem) => void;
}) {
  return (
    <>
      <style>{styles}</style>
      <div className="item-browser-container">
        <GridList 
          itemHeight={64} 
          maxItemsIntoView={maxItemsIntoView} 
          items={items}
          className="item-browser-grid"
        >
          {(item, index) => (
            <div className="item-browser-item" key={item.id}>
              <ItemButton
                ignoreRarityColor={ignoreRarityColor}
                index={index}
                item={item}
                onClick={onClick}
              />
            </div>
          )}
        </GridList>
      </div>
    </>
  );
}