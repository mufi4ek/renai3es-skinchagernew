/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  CS2Economy,
  CS2InventoryItem,
  CS2ItemType,
  CS2_TEAMS_BOTH
} from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { ComponentProps } from "react";
import { has } from "~/utils/misc";
import { usePreferences } from "./app-context";
import { InventoryItemTooltipContents } from "./inventory-item-tooltip-contents";
import { InventoryItemTooltipExterior } from "./inventory-item-tooltip-exterior";
import { InventoryItemTooltipName } from "./inventory-item-tooltip-name";
import { InventoryItemTooltipRarity } from "./inventory-item-tooltip-rarity";
import { InventoryItemTooltipSeed } from "./inventory-item-tooltip-seed";
import { InventoryItemTooltipStatTrak } from "./inventory-item-tooltip-stattrak";
import { InventoryItemTooltipTeams } from "./inventory-item-tooltip-teams";
import { InventoryItemTooltipWear } from "./inventory-item-wear";

const styles = `
.tooltip-container {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.95) 0%, rgba(30, 30, 47, 0.95) 100%);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(42, 42, 58, 0.8);
  border-radius: 10px;
  box-shadow:
    0 20px 45px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(58, 134, 255, 0.12);
  color: #e2e2f0;
  padding: 1rem;
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
  z-index: 180;
}

.tooltip-container::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 10px;
  padding: 1px;
  background: linear-gradient(120deg, rgba(58, 134, 255, 0.4), transparent 40%, rgba(212, 175, 55, 0.25));
  -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.tooltip-container-wide {
  width: 396px;
}

.tooltip-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid rgba(58, 134, 255, 0.15);
  background: rgba(0, 0, 0, 0.2);
}

.tournament-desc {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #a0a0c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.7);
}

.base-description,
.item-description {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #dcdcf0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
  white-space: pre-wrap;
}

.item-description-italic {
  font-style: italic;
  color: #c5d3ff;
}

.stats-section {
  margin-top: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(58, 134, 255, 0.15);
  display: grid;
  gap: 0.5rem;
}
`;

export function InventoryItemTooltip({
  item,
  forwardRef,
  ...props
}: ComponentProps<"div"> & {
  item: CS2InventoryItem;
  forwardRef: typeof props.ref;
}) {
  const { statsForNerds } = usePreferences();
  const isContainer = item.isContainer();
  const containerItem =
    item.containerId !== undefined
      ? CS2Economy.getById(item.containerId)
      : item;
  const hasContents = containerItem.isContainer();
  const hasWear = !item.free && item.hasWear();
  const hasSeed = !item.free && item.hasSeed();
  const hasAttributes = hasWear || hasSeed;
  const hasStatTrak = item.statTrak !== undefined;
  const wear = item.getWear();

  // We don't treat graffiti as equippable for a particular team, but in-game it
  // shows as CT or T, if we were to change cs2-lib it would be a breaking
  // change for graffiti logic, so we just update here.
  const teams =
    item.type === CS2ItemType.Graffiti ? CS2_TEAMS_BOTH : item.teams;
  const hasTeams = teams !== undefined;

  const baseDescription = (item.parent ?? item).desc;
  const itemDescription = item.parent !== undefined ? item.desc : undefined;

  return (
    <>
      <style>{styles}</style>
      <div
        role="tooltip"
        className={clsx(
          "tooltip-container",
          !isContainer && "tooltip-container-wide"
        )}
        ref={forwardRef}
        {...props}
      >
        <InventoryItemTooltipName item={item} />
        <div className="tooltip-grid">
          <InventoryItemTooltipRarity item={item} />
          {hasWear && <InventoryItemTooltipExterior wear={wear} />}
          {hasTeams && <InventoryItemTooltipTeams teams={teams} />}
        </div>
        {has(item.tournamentDesc) && (
          <p className="tournament-desc">{item.tournamentDesc}</p>
        )}
        {hasStatTrak && (
          <InventoryItemTooltipStatTrak
            type={item.type}
            statTrak={item.statTrak}
          />
        )}
        {has(baseDescription) && (
          <p className="base-description">
            {baseDescription}
          </p>
        )}
        {has(itemDescription) && (
          <p
            className={clsx(
              "item-description",
              item.isPaintable() && "item-description-italic"
            )}
          >
            {itemDescription}
          </p>
        )}
        {statsForNerds && hasAttributes && (
          <div className="stats-section">
            {hasWear && <InventoryItemTooltipWear wear={wear} />}
            {hasSeed && <InventoryItemTooltipSeed seed={item.seed} />}
          </div>
        )}
      </div>
    </>
  );
}