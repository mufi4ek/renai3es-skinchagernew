/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2Economy } from "@ianlucas/cs2-lib";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useSync } from "~/components/hooks/use-sync";
import { SyncAction } from "~/data/sync";
import { playSound } from "~/utils/sound";
import { useInventory, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { Modal, ModalHeader } from "./modal";
import { ModalButton } from "./modal-button";
import { Overlay } from "./overlay";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const styles = `
.remove-item-patch-overlay {
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  position: relative;
  min-height: 100vh;
}

.remove-item-patch-overlay::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(58, 134, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(131, 56, 236, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.remove-item-patch-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

.remove-item-patch-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.7;
}

.remove-item-patch-stickers {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(26, 26, 38, 0.5);
  margin: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2a3a;
}

.remove-item-patch-sticker-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.remove-item-patch-sticker-button:hover {
  transform: translateY(-2px);
}

.remove-item-patch-sticker-button:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.remove-item-patch-sticker-image {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
  transition: all 0.3s ease;
}

.remove-item-patch-sticker-button:hover .remove-item-patch-sticker-image {
  filter: drop-shadow(0 8px 20px rgba(58, 134, 255, 0.3)) brightness(1.1);
  transform: scale(1.05);
}

.remove-item-patch-confirm-modal {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.remove-item-patch-confirm-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}
`;

export function RemoveItemPatch({
  onClose,
  uid
}: {
  onClose: () => void;
  uid: number;
}) {
  const nameItemString = useNameItemString();
  const translate = useTranslate();
  const sync = useSync();

  const [inventory, setInventory] = useInventory();
  const [confirmRemoveSlot, setConfirmRemoveSlot] = useState<number>();

  const item = inventory.get(uid);

  function doRemovePatch(slot: number) {
    sync({
      type: SyncAction.RemoveItemPatch,
      targetUid: uid,
      slot: slot
    });
    setInventory(inventory.removeItemPatch(uid, slot));
    playSound("inventory_new_item_accept");
    if (item.getPatchesCount() === 0) {
      onClose();
    }
  }

  function handleConfirmScrape() {
    if (confirmRemoveSlot !== undefined) {
      doRemovePatch(confirmRemoveSlot);
      setConfirmRemoveSlot(undefined);
    }
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{styles}</style>
            <Overlay className="remove-item-patch-overlay">
              <div className="remove-item-patch-container">
                <UseItemHeader
                  title={translate("ScrapeStickerUse")}
                  warning={translate("RemovePatchWarn")}
                  warningItem={nameItemString(item)}
                />
                <ItemImage className="m-auto max-w-[512px] filter drop-shadow-lg" item={item} />
                <div className="remove-item-patch-stickers">
                  {item.somePatches().map(([slot, id]) => (
                    <button 
                      key={slot} 
                      className="remove-item-patch-sticker-button group"
                      onClick={() => setConfirmRemoveSlot(slot)}
                    >
                      <ItemImage
                        className="remove-item-patch-sticker-image w-[168px] scale-90 transition-all group-hover:scale-100 group-active:scale-110"
                        item={CS2Economy.getById(id)}
                      />
                    </button>
                  ))}
                </div>
                <UseItemFooter
                  right={
                    <ModalButton
                      children={translate("ScrapeStickerClose")}
                      onClick={onClose}
                      variant="secondary"
                    />
                  }
                />
              </div>
            </Overlay>
            {confirmRemoveSlot !== undefined && (
              <Modal className="remove-item-patch-confirm-modal w-[480px]" fixed>
                <ModalHeader title={translate("RemovePatchRemove")} />
                <p className="mt-2 px-4 text-gray-300">
                  {translate("RemovePatchRemoveDesc")}
                </p>
                <div className="my-6 flex justify-center gap-3 px-4">
                  <ModalButton
                    onClick={() => setConfirmRemoveSlot(undefined)}
                    variant="secondary"
                    children={translate("ScrapeStickerCancel")}
                  />
                  <ModalButton
                    onClick={handleConfirmScrape}
                    variant="primary"
                    children={translate("RemovePatchRemove")}
                  />
                </div>
              </Modal>
            )}
          </>,
          document.body
        )
      }
    />
  );
}