/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CS2Economy,
  CS2EconomyItem,
  CS2InventoryItem,
  getTimestamp
} from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { useNameItem } from "~/components/hooks/use-name-item";
import { has } from "~/utils/misc";
import { useTranslate } from "./app-context";
import { ItemImage } from "./item-image";

const styles = `
.inventory-tile {
  width: 154px;
  position: relative;
}

.tile-container {
  position: relative;
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.3) 0%, rgba(131, 56, 236, 0.2) 100%);
  border-radius: 8px;
  padding: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tile-container:hover {
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.4) 0%, rgba(131, 56, 236, 0.3) 100%);
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.tile-inner {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.9) 0%, rgba(30, 30, 47, 0.8) 100%);
  border-radius: 6px;
  padding: 4px;
  backdrop-filter: blur(5px);
}

.new-badge {
  background: linear-gradient(135deg, #3a86ff 0%, #8338ec 100%);
  border-radius: 4px 0 4px 0;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #e2e2f0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow: 0 2px 8px rgba(58, 134, 255, 0.3);
  transition: all 0.3s ease;
}

.new-badge:hover {
  color: #ffffff;
  box-shadow: 0 2px 12px rgba(58, 134, 255, 0.5);
}

.stickers-container, .patches-container {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 4px;
  padding: 2px;
  margin: 2px;
}

.equipped-indicator {
  background: rgba(21, 21, 32, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 4px;
  padding: 4px;
  margin: 2px;
}

.equipped-icon {
  color: inherit;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.5));
  transition: transform 0.3s ease;
}

.equipped-icon:hover {
  transform: scale(1.1);
}

.select-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.1) 0%, rgba(131, 56, 236, 0.05) 100%);
  transition: all 0.3s ease;
  cursor: pointer;
}

.select-overlay:hover {
  border-color: rgba(58, 134, 255, 0.6);
  background: linear-gradient(145deg, rgba(58, 134, 255, 0.2) 0%, rgba(131, 56, 236, 0.1) 100%);
  box-shadow: 0 0 20px rgba(58, 134, 255, 0.2);
}

.rarity-bar {
  height: 3px;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin-top: 2px;
}

.item-info {
  font-family: 'Rajdhani', sans-serif;
  font-size: 12px;
  line-height: 1.2;
  color: #e2e2f0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
  margin-top: 4px;
  word-break: break-word;
}

.item-model {
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 5px rgba(58, 134, 255, 0.5);
}

.item-name {
  color: #a0a0c0;
}
`;

export function InventoryItemTile({
  equipped,
  item,
  onClick
}: {
  equipped?: (string | false | undefined)[];
  item: CS2EconomyItem | CS2InventoryItem;
  onClick?: () => void;
}) {
  const translate = useTranslate();
  const nameItem = useNameItem();
  const inventoryItem = item instanceof CS2InventoryItem ? item : undefined;
  const [model, name] = nameItem(item, "inventory-name");

  const currDate = getTimestamp();
  const isNew =
    inventoryItem?.updatedAt !== undefined &&
    currDate - inventoryItem.updatedAt < 120;

  return (
    <>
      <style>{styles}</style>
      <div className="inventory-tile">
        <div className="tile-container">
          <div className="tile-inner">
            <ItemImage className="w-[144px]" item={item} />
            
            {isNew && (
              <div className="new-badge absolute top-[2px] left-[2px]">
                {translate("InventoryItemNew")}
              </div>
            )}
            
            {inventoryItem?.stickers !== undefined && (
              <div className="stickers-container absolute bottom-0 left-0 flex items-center">
                {inventoryItem.someStickers().map(([slot, { id }]) => (
                  <ItemImage
                    className="h-5"
                    item={CS2Economy.getById(id)}
                    key={slot}
                  />
                ))}
              </div>
            )}
            
            {inventoryItem?.patches !== undefined && (
              <div className="patches-container absolute bottom-0 left-0 flex items-center">
                {inventoryItem.somePatches().map(([slot, id]) => (
                  <ItemImage
                    className="h-5"
                    item={CS2Economy.getById(id)}
                    key={slot}
                  />
                ))}
              </div>
            )}
            
            {equipped !== undefined && (
              <div className="equipped-indicator absolute top-0 right-0 flex items-center gap-1">
                {equipped.map((color, colorIndex) =>
                  typeof color === "string" ? (
                    <FontAwesomeIcon
                      key={colorIndex}
                      className={clsx("equipped-icon h-3.5", color)}
                      icon={faCircleDot}
                    />
                  ) : null
                )}
              </div>
            )}
            
            {onClick !== undefined && (
              <button
                className="select-overlay"
                onClick={onClick}
              />
            )}
          </div>
        </div>
        
        <div
          className="rarity-bar"
          style={{ backgroundColor: item.rarity }}
        />
        
        <div className="item-info">
          {has(model) && <div className="item-model">{model}</div>}
          {has(name) && <div className="item-name">{name}</div>}
        </div>
      </div>
    </>
  );
}