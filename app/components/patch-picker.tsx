/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  faMagnifyingGlass,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {
  CS2BaseInventoryItem,
  CS2Economy,
  CS2EconomyItem,
  CS2ItemType,
  CS2_MAX_PATCHES,
  ensure
} from "@ianlucas/cs2-lib";
import { useMemo, useState } from "react";
import { useInput } from "~/components/hooks/use-input";
import { sortByName } from "~/utils/economy";
import { range } from "~/utils/number";
import { useTranslate } from "./app-context";
import { IconButton } from "./icon-button";
import { IconInput } from "./icon-input";
import { ItemBrowser } from "./item-browser";
import { ItemImage } from "./item-image";
import { Modal, ModalHeader } from "./modal";

const styles = `
.patch-picker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.25rem;
}

.patch-slot {
  position: relative;
  aspect-ratio: 256/192;
  cursor: pointer;
  overflow: hidden;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.patch-slot:hover {
  background: linear-gradient(145deg, rgba(30, 30, 47, 0.8) 0%, rgba(42, 42, 58, 0.6) 100%);
  border-color: rgba(58, 134, 255, 0.4);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.patch-slot:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.patch-slot:disabled:hover {
  transform: none;
  border-color: rgba(42, 42, 58, 0.6);
}

.patch-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c6c8a;
  font-size: 0.875rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.patch-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border: 2px solid transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.patch-slot:hover .patch-hover-overlay {
  border-color: rgba(58, 134, 255, 0.5);
  box-shadow: inset 0 0 20px rgba(58, 134, 255, 0.1);
}

.patch-picker-modal {
  width: 540px;
  padding-bottom: 0.25rem;
}

.patch-picker-controls {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem;
}

@media (min-width: 1024px) {
  .patch-picker-controls {
    flex-direction: row;
    align-items: center;
  }
}

.patch-search-input {
  flex: 1;
}

.patch-remove-button {
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #ef4444;
  transition: all 0.3s ease;
}

.patch-remove-button:hover {
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.25) 100%);
  border-color: rgba(239, 68, 68, 0.6);
  transform: scale(1.05);
}

.patch-remove-button:active {
  transform: scale(0.95);
}
`;

export function PatchPicker({
  disabled,
  onChange,
  patchFilter,
  value
}: {
  disabled?: boolean;
  onChange: (value: NonNullable<CS2BaseInventoryItem["patches"]>) => void;
  patchFilter?: (item: CS2EconomyItem) => boolean;
  value: NonNullable<CS2BaseInventoryItem["patches"]>;
}) {
  const translate = useTranslate();

  const [search, setSearch] = useInput("");
  const [activeIndex, setActiveIndex] = useState<number>();
  const patches = useMemo(
    () => CS2Economy.filterItems({ type: CS2ItemType.Patch }).sort(sortByName),
    []
  );

  function handleClickSlot(index: number) {
    return function handleClickSlot() {
      setActiveIndex(index);
    };
  }

  function handleAddPatch(item: CS2EconomyItem) {
    onChange({
      ...value,
      [ensure(activeIndex)]: item.id
    });
    setActiveIndex(undefined);
  }

  function handleRemovePatch() {
    const newValue = { ...value };
    delete newValue[ensure(activeIndex)];
    onChange(newValue);
    setActiveIndex(undefined);
  }

  function handleCloseModal() {
    setActiveIndex(undefined);
  }

  const filtered = useMemo(() => {
    const words = search.split(" ").map((word) => word.toLowerCase());
    return patches.filter((item) => {
      if (patchFilter !== undefined && !patchFilter(item)) {
        return false;
      }
      const name = item.name.toLowerCase();
      for (const word of words) {
        if (word.length > 0 && name.indexOf(word) === -1) {
          return false;
        }
      }
      return true;
    });
  }, [search]);

  return (
    <>
      <style>{styles}</style>
      <div className="patch-picker-grid">
        {range(CS2_MAX_PATCHES).map((index) => {
          const patchId = value[index];
          const item =
            patchId !== undefined ? CS2Economy.getById(patchId) : undefined;
          return (
            <button
              disabled={disabled}
              key={index}
              className="patch-slot"
              onClick={handleClickSlot(index)}
            >
              {item !== undefined ? (
                <ItemImage item={item} />
              ) : (
                <div className="patch-empty">
                  {translate("StickerPickerNA")}
                </div>
              )}
              {!disabled && (
                <div className="patch-hover-overlay" />
              )}
            </button>
          );
        })}
      </div>
      <Modal className="patch-picker-modal" hidden={activeIndex === undefined} blur>
        <ModalHeader
          title={translate("PatchPickerHeader")}
          onClose={handleCloseModal}
        />
        <div className="patch-picker-controls">
          <IconInput
            icon={faMagnifyingGlass}
            onChange={setSearch}
            placeholder={translate("PatchPickerSearchPlaceholder")}
            value={search}
          />
          <IconButton
            icon={faTrashCan}
            onClick={handleRemovePatch}
            title={translate("StickerPickerRemove")}
          />
        </div>
        <ItemBrowser items={filtered} onClick={handleAddPatch} />
      </Modal>
    </>
  );
}