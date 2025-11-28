/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2EconomyItem } from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { useNameItem } from "~/components/hooks/use-name-item";
import { has } from "~/utils/misc";

const styles = `
.item-editor-name {
  font-family: 'Rajdhani', sans-serif;
  background: linear-gradient(135deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(42, 42, 58, 0.6);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
}

.item-editor-name::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.model-text {
  font-size: 0.875rem;
  color: #a0a0c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  font-weight: 500;
  letter-spacing: 0.5px;
}

.name-text {
  font-weight: 700;
  font-size: 1.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  background: linear-gradient(135deg, #e2e2f0 0%, #a0a0c0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.name-text.with-model {
  margin-top: -0.375rem;
}

/* Override gradient text with rarity color */
.name-text[style] {
  background: none !important;
  -webkit-text-fill-color: initial !important;
  background-clip: initial !important;
}
`;

export function ItemEditorName({ item }: { item: CS2EconomyItem }) {
  const { rarity } = item;
  const nameItem = useNameItem();
  const [model, name] = nameItem(item, "editor-name");

  return (
    <>
      <style>{styles}</style>
      <div className="item-editor-name">
        {has(model) && <div className="model-text">{model}</div>}
        <div
          className={clsx("name-text", has(model) && "with-model")}
          style={{ color: rarity }}
        >
          {name}
        </div>
      </div>
    </>
  );
}