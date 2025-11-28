/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2InventoryItem } from "@ianlucas/cs2-lib";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { ItemImage } from "./item-image";

const styles = `
.inventory-tooltip-name {
  color: #e2e2f0;
  font-family: 'Rajdhani', sans-serif;
}

.inventory-tooltip-name-bold {
  font-weight: 700;
  font-size: 1.1rem;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.inventory-tooltip-collection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border-radius: 6px;
  border: 1px solid rgba(42, 42, 58, 0.6);
}

.inventory-tooltip-collection-image {
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5));
  border-radius: 4px;
  overflow: hidden;
}

.inventory-tooltip-collection-text {
  flex: 1;
}

.inventory-tooltip-collection-name {
  color: #a0a0c0;
  font-size: 0.9rem;
  margin-top: 0.25rem;
}
`;

export function InventoryItemTooltipName({ item }: { item: CS2InventoryItem }) {
  const nameItemString = useNameItemString();

  const content =
    item.collectionName === undefined ? (
      <div className="inventory-tooltip-name-bold">{nameItemString(item)}</div>
    ) : (
      <div className="inventory-tooltip-collection">
        <ItemImage
          className="inventory-tooltip-collection-image h-10"
          item={item}
          type="collection"
        />
        <div className="inventory-tooltip-collection-text">
          <div className="inventory-tooltip-name-bold">{nameItemString(item)}</div>
          <div className="inventory-tooltip-collection-name">{item.collectionName}</div>
        </div>
      </div>
    );

  return (
    <>
      <style>{styles}</style>
      {content}
    </>
  );
}