/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  CS2Economy,
  CS2_MAX_STICKER_WEAR,
  CS2_STICKER_WEAR_FACTOR,
  CS2_WEAR_FACTOR
} from "@ianlucas/cs2-lib";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useSync } from "~/components/hooks/use-sync";
import { SyncAction } from "~/data/sync";
import { playSound } from "~/utils/sound";
import { useInventory, usePreferences, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { Modal, ModalHeader } from "./modal";
import { ModalButton } from "./modal-button";
import { Overlay } from "./overlay";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const styles = `
.scrape-item-sticker-overlay {
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  position: relative;
  min-height: 100vh;
}

.scrape-item-sticker-overlay::before {
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

.scrape-item-sticker-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

.scrape-item-sticker-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.7;
}

.scrape-item-sticker-image {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6));
  margin: 2rem auto;
  max-width: 512px;
}

.scrape-item-stickers-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(26, 26, 38, 0.5);
  margin: 1rem;
  border-radius: 8px;
  border: 1px solid #2a2a3a;
}

.scrape-item-sticker-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.scrape-item-sticker-button:hover {
  transform: translateY(-2px);
}

.scrape-item-sticker-button:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.scrape-item-sticker-preview {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
  transition: all 0.3s ease;
}

.scrape-item-sticker-button:hover .scrape-item-sticker-preview {
  filter: drop-shadow(0 8px 20px rgba(58, 134, 255, 0.3)) brightness(1.1);
  transform: scale(1.05);
}

.scrape-item-sticker-wear-text {
  color: #a0a0c0;
  font-size: 0.875rem;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
}

.scrape-item-sticker-button:hover .scrape-item-sticker-wear-text {
  color: #3a86ff;
  transform: scale(1.1);
}

.scrape-item-confirm-modal {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.scrape-item-confirm-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.scrape-item-confirm-text {
  color: #e2e2f0;
  margin-top: 0.5rem;
  padding: 0 1rem;
}
`;

export function ScrapeItemSticker({
  onClose,
  uid
}: {
  onClose: () => void;
  uid: number;
}) {
  const nameItemString = useNameItemString();
  const { statsForNerds } = usePreferences();
  const [inventory, setInventory] = useInventory();

  const translate = useTranslate();
  const sync = useSync();

  const [confirmScrapeIndex, setConfirmScrapeIndex] = useState<number>();

  const item = inventory.get(uid);

  function doScrapeSticker(slot: number) {
    const scratch = Math.ceil(
      (item.getStickerWear(slot) + CS2_STICKER_WEAR_FACTOR) * 5
    );
    sync({
      type: SyncAction.ScrapeItemSticker,
      targetUid: uid,
      slot: slot
    });
    setInventory(inventory.scrapeItemSticker(uid, slot));
    playSound(`sticker_scratch${scratch as 1 | 2 | 3 | 4 | 5}`);
    if (item.getStickersCount() === 0) {
      onClose();
    }
  }

  function handleScrapeSticker(slot: number) {
    if (item.getStickerWear(slot) + CS2_WEAR_FACTOR > CS2_MAX_STICKER_WEAR) {
      setConfirmScrapeIndex(slot);
    } else {
      doScrapeSticker(slot);
    }
  }

  function handleConfirmScrape() {
    if (confirmScrapeIndex !== undefined) {
      // We do twice because wear 0 is probably invisible in-game. If this
      // doesn't hold true, we'll need to change this.
      doScrapeSticker(confirmScrapeIndex);
      doScrapeSticker(confirmScrapeIndex);
      setConfirmScrapeIndex(undefined);
    }
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{styles}</style>
            <Overlay className="scrape-item-sticker-overlay">
              <div className="scrape-item-sticker-container">
                <UseItemHeader
                  title={translate("ScrapeStickerUse")}
                  warning={translate("ScrapeStickerWarn")}
                  warningItem={nameItemString(item)}
                />
                <ItemImage className="scrape-item-sticker-image" item={item} />
                <div className="scrape-item-stickers-container">
                  {item.someStickers().map(([index, { id, wear }]) => (
                    <button key={index} className="scrape-item-sticker-button group">
                      <ItemImage
                        className="scrape-item-sticker-preview w-[168px] scale-90 transition-all group-hover:scale-100 group-active:scale-110"
                        onClick={() => handleScrapeSticker(index)}
                        style={{
                          filter: `grayscale(${wear ?? 0})`,
                          opacity: `${1 - (wear ?? 0)}`
                        }}
                        item={CS2Economy.getById(id)}
                      />
                      {statsForNerds && (
                        <div className="scrape-item-sticker-wear-text transition-all group-hover:scale-110">
                          {((wear ?? 0) * 100).toFixed(0)}%
                        </div>
                      )}
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
            {confirmScrapeIndex !== undefined && (
              <Modal className="scrape-item-confirm-modal w-[480px]" fixed>
                <ModalHeader title={translate("ScrapeStickerRemove")} />
                <p className="scrape-item-confirm-text">
                  {translate("ScrapeStickerRemoveDesc")}
                </p>
                <div className="my-6 flex justify-center gap-3 px-4">
                  <ModalButton
                    onClick={() => setConfirmScrapeIndex(undefined)}
                    variant="secondary"
                    children={translate("ScrapeStickerCancel")}
                  />
                  <ModalButton
                    onClick={handleConfirmScrape}
                    variant="primary"
                    children={translate("ScrapeStickerRemove")}
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