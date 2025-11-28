/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  faMagnifyingGlass,
  faPen,
  faTag,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CS2BaseInventoryItem,
  CS2Economy,
  CS2EconomyItem,
  CS2_MAX_STICKERS,
  CS2_MIN_STICKER_WEAR,
  assert,
  ensure
} from "@ianlucas/cs2-lib";
import { useMemo, useState } from "react";
import { useInput } from "~/components/hooks/use-input";
import { sortByName } from "~/utils/economy";
import { range } from "~/utils/number";
import { useTranslate } from "./app-context";
import { AppliedStickerEditor } from "./applied-sticker-editor";
import { ButtonWithTooltip } from "./button-with-tooltip";
import { IconButton } from "./icon-button";
import { IconInput } from "./icon-input";
import { IconSelect } from "./icon-select";
import { ItemBrowser } from "./item-browser";
import { ItemImage } from "./item-image";
import { Modal, ModalHeader } from "./modal";
import { ModalButton } from "./modal-button";

const styles = `
.sticker-picker-grid {
  display: grid;
  gap: 0.25rem;
  background: rgba(21, 21, 32, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid rgba(42, 42, 58, 0.4);
}

.sticker-slot {
  position: relative;
  aspect-ratio: 256/192;
  overflow: hidden;
  border-radius: 6px;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sticker-slot:hover:not(:disabled) {
  border-color: rgba(58, 134, 255, 0.4);
  box-shadow: 0 0 12px rgba(58, 134, 255, 0.2);
  transform: translateY(-1px);
}

.sticker-slot-button {
  position: absolute;
  height: 100%;
  width: 100%;
  cursor: default;
  overflow: hidden;
  background: rgba(10, 10, 15, 0.3);
}

.sticker-slot-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b6b8a;
  font-size: 0.875rem;
}

.sticker-wear-text {
  position: absolute;
  right: 0.25rem;
  bottom: 0.125rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #e2e2f0;
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 0 4px rgba(0, 0, 0, 0.5);
}

.sticker-edit-button {
  position: absolute;
  bottom: 0.25rem;
  left: 0.25rem;
  background: rgba(42, 42, 58, 0.8);
  border: 1px solid rgba(42, 42, 58, 0.8);
  border-radius: 4px;
  color: #a0a0c0;
  padding: 0.25rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.sticker-edit-button:hover {
  background: rgba(58, 134, 255, 0.3);
  border-color: rgba(58, 134, 255, 0.5);
  color: #3a86ff;
  transform: scale(1.05);
}

.sticker-picker-modal {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.sticker-picker-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.sticker-picker-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0.5rem 0.5rem 0 0.5rem;
  padding: 0.75rem;
  background: rgba(26, 26, 38, 0.5);
  border-radius: 8px;
  border: 1px solid rgba(42, 42, 58, 0.4);
}

@media (min-width: 1024px) {
  .sticker-picker-controls {
    flex-direction: row;
    align-items: center;
  }
}

.sticker-picker-search {
  flex: 1;
}

.sticker-picker-select {
  width: 10.5rem;
}

.sticker-picker-delete-button {
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
  transition: all 0.3s ease;
}

.sticker-picker-delete-button:hover {
  background: linear-gradient(145deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%);
  border-color: rgba(239, 68, 68, 0.5);
  color: #f87171;
  transform: scale(1.05);
}

.sticker-confirm-modal {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.sticker-confirm-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}
`;

export function StickerPicker({
  disabled,
  forItem,
  isHideStickerRotation,
  isHideStickerWear,
  isHideStickerX,
  isHideStickerY,
  onChange,
  stickerFilter,
  value
}: {
  disabled?: boolean;
  forItem?: CS2EconomyItem;
  isHideStickerRotation?: boolean;
  isHideStickerWear?: boolean;
  isHideStickerX?: boolean;
  isHideStickerY?: boolean;
  onChange: (value: NonNullable<CS2BaseInventoryItem["stickers"]>) => void;
  stickerFilter?: (item: CS2EconomyItem) => boolean;
  value: NonNullable<CS2BaseInventoryItem["stickers"]>;
}) {
  const translate = useTranslate();

  const [category, setCategory] = useState("");
  const [search, setSearch] = useInput("");
  const [activeIndex, setActiveIndex] = useState<number>();
  const stickers = useMemo(() => CS2Economy.getStickers().sort(sortByName), []);
  const categories = useMemo(() => CS2Economy.getStickerCategories(), []);
  const [appliedStickerData, setAppliedStickerData] = useState({
    rotation: 0,
    wear: 0,
    x: 0,
    y: 0
  });
  const [selected, setSelected] = useState<CS2EconomyItem>();
  const [isEditing, setIsEditing] = useState(false);
  const canEditStickerAttributes =
    !isHideStickerRotation &&
    !isHideStickerWear &&
    !isHideStickerX &&
    !isHideStickerY;

  function handleClickSlot(index: number) {
    return function handleClickSlot() {
      setActiveIndex(index);
    };
  }

  function handleClickEditSlot(index: number) {
    return function handleClickSlot() {
      const { id, rotation, wear, x, y } = value[index];
      setAppliedStickerData({
        rotation: rotation ?? 0,
        wear: wear ?? 0,
        x: x ?? 0,
        y: y ?? 0
      });
      setActiveIndex(index);
      setSelected(CS2Economy.getById(id));
      setIsEditing(true);
    };
  }

  function handleSelectSticker(item: CS2EconomyItem) {
    setSelected(item);
  }

  function handleCloseSelectModal() {
    if (isEditing) {
      setActiveIndex(undefined);
    }
    setSelected(undefined);
    setIsEditing(false);
  }

  function handleAddSticker() {
    assert(selected);
    onChange({
      ...value,
      [ensure(activeIndex)]: {
        id: selected.id,
        rotation: appliedStickerData.rotation || undefined,
        wear: appliedStickerData.wear || undefined,
        x: appliedStickerData.x || undefined,
        y: appliedStickerData.y || undefined
      }
    });
    setSelected(undefined);
    setActiveIndex(undefined);
    setIsEditing(false);
  }

  function handleRemoveSticker() {
    const updated = { ...value };
    delete updated[ensure(activeIndex)];
    onChange(updated);
    setActiveIndex(undefined);
    setIsEditing(false);
  }

  function handleCloseModal() {
    setActiveIndex(undefined);
    setIsEditing(false);
  }

  const filtered = useMemo(() => {
    const words = search.split(" ").map((word) => word.toLowerCase());
    return stickers.filter((item) => {
      if (stickerFilter !== undefined && !stickerFilter(item)) {
        return false;
      }
      if (category !== "" && item.category !== category) {
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
  }, [search, category]);

  return (
    <>
      <style>{styles}</style>
      <div
        className="sticker-picker-grid"
        style={{
          gridTemplateColumns: `repeat(${CS2_MAX_STICKERS}, minmax(0, 1fr))`
        }}
      >
        {range(CS2_MAX_STICKERS).map((index) => {
          const sticker = value[index];
          const stickerWear = sticker?.wear ?? CS2_MIN_STICKER_WEAR;
          const item =
            sticker !== undefined ? CS2Economy.getById(sticker.id) : undefined;
          return (
            <div className="sticker-slot" key={index}>
              <button
                disabled={disabled}
                className="sticker-slot-button"
                onClick={handleClickSlot(index)}
              >
                {item !== undefined ? (
                  <ItemImage item={item} />
                ) : (
                  <div className="sticker-slot-empty">
                    {translate("StickerPickerNA")}
                  </div>
                )}
                {sticker !== undefined && (
                  <div className="sticker-wear-text">
                    {(stickerWear * 100).toFixed(0)}%
                  </div>
                )}
                {!disabled && (
                  <div className="absolute top-0 left-0 h-full w-full border-2 border-transparent hover:border-blue-500/30" />
                )}
              </button>
              {item !== undefined && !disabled && (
                <div className="sticker-edit-button">
                  <ButtonWithTooltip
                    onClick={handleClickEditSlot(index)}
                    tooltip={translate("EditorStickerEdit")}
                  >
                    <FontAwesomeIcon icon={faPen} className="h-3" />
                  </ButtonWithTooltip>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Modal
        className="sticker-picker-modal w-[540px] pb-1"
        hidden={activeIndex === undefined || isEditing}
        blur
      >
        <ModalHeader
          title={translate("StickerPickerHeader")}
          onClose={handleCloseModal}
        />
        <div className="sticker-picker-controls">
          <IconInput
            icon={faMagnifyingGlass}
            labelStyles="sticker-picker-search"
            onChange={setSearch}
            placeholder={translate("StickerPickerSearchPlaceholder")}
            value={search}
          />
          <IconSelect
            icon={faTag}
            className="sticker-picker-select"
            onChange={setCategory}
            options={categories}
            placeholder={translate("StickerPickerFilterPlaceholder")}
            value={category}
          />
          <div className="sticker-picker-delete-button">
            <IconButton
              icon={faTrashCan}
              onClick={handleRemoveSticker}
              title={translate("StickerPickerRemove")}
            />
          </div>
        </div>
        <ItemBrowser items={filtered} onClick={handleSelectSticker} />
      </Modal>
      {selected !== undefined && (
        <Modal className="sticker-confirm-modal w-[420px]">
          <ModalHeader
            title={translate("EditorConfirmPick")}
            onClose={handleCloseSelectModal}
          />
          {canEditStickerAttributes && (
            <AppliedStickerEditor
              slot={activeIndex}
              className="px-4"
              forItem={forItem}
              item={selected}
              onChange={setAppliedStickerData}
              stickers={value}
              value={appliedStickerData}
            />
          )}
          <div className="my-6 flex justify-center gap-3 px-4">
            <ModalButton
              children={translate("EditorCancel")}
              onClick={handleCloseSelectModal}
              variant="secondary"
            />
            <ModalButton
              children={translate("EditorPick")}
              onClick={handleAddSticker}
              variant="primary"
            />
          </div>
        </Modal>
      )}
    </>
  );
}