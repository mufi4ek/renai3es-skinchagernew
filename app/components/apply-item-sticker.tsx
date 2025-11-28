/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CS2Economy } from "@ianlucas/cs2-lib";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useInventoryItem } from "~/components/hooks/use-inventory-item";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useSync } from "~/components/hooks/use-sync";
import { SyncAction } from "~/data/sync";
import { playSound } from "~/utils/sound";
import { useInventory, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { ModalButton } from "./modal-button";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const stickerStyles = `
.apply-sticker-overlay {
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.apply-sticker-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(58, 134, 255, 0.1);
  max-width: 900px;
  width: 95%;
  margin: 2rem;
  position: relative;
  overflow: hidden;
}

.apply-sticker-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.apply-sticker-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #2a2a3a;
  background: linear-gradient(to bottom, rgba(30, 30, 47, 0.9), transparent);
}

.apply-sticker-content {
  padding: 2rem;
}

.apply-sticker-target {
  margin-bottom: 2rem;
}

.apply-sticker-target-image {
  border-radius: 8px;
  border: 1px solid #2a2a3a;
  background: linear-gradient(145deg, #0a0a0f 0%, #151520 100%);
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.apply-sticker-slots {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.sticker-slot {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.sticker-slot::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sticker-slot:hover {
  border-color: #3a3a4a;
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(58, 134, 255, 0.1);
}

.sticker-slot:hover::before {
  opacity: 1;
}

.sticker-slot.selected {
  border-color: #3a86ff;
  box-shadow: 
    0 0 20px rgba(58, 134, 255, 0.2),
    inset 0 0 20px rgba(58, 134, 255, 0.1);
  animation: sticker-slot-pulse 2s infinite;
}

@keyframes sticker-slot-pulse {
  0%, 100% {
    box-shadow: 
      0 0 20px rgba(58, 134, 255, 0.2),
      inset 0 0 20px rgba(58, 134, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 0 30px rgba(58, 134, 255, 0.3),
      inset 0 0 25px rgba(58, 134, 255, 0.15);
  }
}

.sticker-slot-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 168px;
  height: 126px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: none;
}

.sticker-slot-empty:hover {
  background: linear-gradient(145deg, #1a1a2a 0%, #232337 100%);
}

.sticker-slot-add {
  border: 2px dashed #3a3a4a;
  border-radius: 6px;
  padding: 1rem 1.5rem;
  color: #a0a0c0;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticker-slot-empty:hover .sticker-slot-add {
  border-color: #3a86ff;
  color: #3a86ff;
  box-shadow: 0 0 15px rgba(58, 134, 255, 0.2);
  transform: scale(1.05);
}

.apply-sticker-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #2a2a3a;
  background: linear-gradient(to top, rgba(30, 30, 47, 0.9), transparent);
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.sticker-image-container {
  background: linear-gradient(145deg, #0a0a0f 0%, #151520 100%);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid #2a2a3a;
}
`;

export function ApplyItemSticker({
  onClose,
  targetUid,
  stickerUid
}: {
  onClose: () => void;
  targetUid: number;
  stickerUid: number;
}) {
  const [inventory, setInventory] = useInventory();
  const translate = useTranslate();
  const sync = useSync();
  const nameItemString = useNameItemString();

  const [slot, setSlot] = useState<number>();
  const stickerItem = useInventoryItem(stickerUid);
  const targetItem = useInventoryItem(targetUid);

  function handleApplySticker() {
    if (slot !== undefined) {
      if (targetUid >= 0) {
        sync({
          type: SyncAction.ApplyItemSticker,
          targetUid,
          slot,
          stickerUid
        });
        setInventory(inventory.applyItemSticker(targetUid, stickerUid, slot));
        playSound("sticker_apply_confirm");
        onClose();
      } else {
        sync({
          type: SyncAction.AddWithSticker,
          stickerUid,
          itemId: targetItem.id,
          slot
        });
        setInventory(inventory.addWithSticker(stickerUid, targetItem.id, slot));
        playSound("sticker_apply_confirm");
        onClose();
      }
    }
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{stickerStyles}</style>
            <div className="apply-sticker-overlay">
              <div className="apply-sticker-container">
                <div className="apply-sticker-header">
                  <UseItemHeader
                    actionDesc={translate("ApplyStickerUseOn")}
                    actionItem={nameItemString(targetItem)}
                    title={translate("ApplyStickerUse")}
                    warning={translate("ApplyStickerWarn")}
                  />
                </div>
                <div className="apply-sticker-content">
                  <div className="apply-sticker-target">
                    <div className="sticker-image-container">
                      <ItemImage className="m-auto max-w-[512px]" item={targetItem} />
                    </div>
                  </div>
                  <div className="apply-sticker-slots">
                    {targetItem.allStickers().map(([xslot, sticker]) =>
                      xslot === 4 ? undefined : sticker !== undefined ||
                        xslot === slot ? (
                        <div
                          key={xslot}
                          className={`sticker-slot ${xslot === slot ? "selected" : ""}`}
                        >
                          <ItemImage
                            className="w-[168px]"
                            item={
                              sticker !== undefined
                                ? CS2Economy.getById(sticker.id)
                                : stickerItem
                            }
                          />
                        </div>
                      ) : (
                        <button
                          key={xslot}
                          className="sticker-slot sticker-slot-empty"
                          onClick={() => {
                            setSlot(xslot);
                            playSound("sticker_apply");
                          }}
                        >
                          <div className="sticker-slot-add">
                            <FontAwesomeIcon className="h-4" icon={faPlus} />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
                <div className="apply-sticker-footer">
                  <UseItemFooter
                    right={
                      <>
                        <ModalButton
                          children={translate("ApplyStickerUse")}
                          disabled={slot === undefined}
                          onClick={handleApplySticker}
                          variant="primary"
                        />
                        <ModalButton
                          children={translate("ApplyStickerCancel")}
                          onClick={onClose}
                          variant="secondary"
                        />
                      </>
                    }
                  />
                </div>
              </div>
            </div>
          </>,
          document.body
        )
      }
    />
  );
}