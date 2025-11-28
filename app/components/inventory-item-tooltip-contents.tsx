/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2EconomyItem } from "@ianlucas/cs2-lib";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useTranslate } from "./app-context";

const styles = `
.contents-container {
  margin-top: 1rem;
}

.contents-title {
  color: #a0a0c0;
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.contents-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  transition: all 0.2s ease;
  border-radius: 3px;
}

.contents-item:hover {
  background: rgba(58, 134, 255, 0.1);
  transform: translateX(2px);
}

.item-name {
  flex: 1;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  transition: color 0.2s ease;
}

.rare-item-notice {
  color: #fbbf24;
  font-weight: 600;
  margin-top: 0.75rem;
  padding: 0.5rem;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), transparent);
  border-left: 2px solid #fbbf24;
  border-radius: 0 4px 4px 0;
  text-shadow: 0 0 8px rgba(251, 191, 36, 0.3);
  animation: pulse-gold 2s infinite;
}

@keyframes pulse-gold {
  0%, 100% {
    box-shadow: 0 0 0 rgba(251, 191, 36, 0.1);
  }
  50% {
    box-shadow: 0 0 10px rgba(251, 191, 36, 0.2);
  }
}
`;

export function InventoryItemTooltipContents({
  containerItem: item
}: {
  containerItem: CS2EconomyItem;
}) {
  const translate = useTranslate();
  const nameItemString = useNameItemString();

  return (
    <>
      <style>{styles}</style>
      <div className="contents-container">
        <div className="contents-title">
          {translate("InventoryItemContainsOne")}
        </div>
        {item.listContents(true).map((item) => (
          <div
            className="contents-item"
            key={item.id}
            style={{ color: item.rarity }}
          >
            <div className="item-name">
              {nameItemString(item, "case-contents-name")}
            </div>
          </div>
        ))}
        {item.specials !== undefined && (
          <div className="rare-item-notice">
            {translate("InventoryItemRareItem")}
          </div>
        )}
      </div>
    </>
  );
}