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

export function ApplyItemPatch({
  onClose,
  targetUid,
  patchUid
}: {
  onClose: () => void;
  targetUid: number;
  patchUid: number;
}) {
  const [inventory, setInventory] = useInventory();
  const translate = useTranslate();
  const sync = useSync();
  const nameItemString = useNameItemString();

  const [slot, setSlot] = useState<number>();
  const stickerItem = useInventoryItem(patchUid);
  const targetItem = useInventoryItem(targetUid);

  function handleApplyPatch() {
    if (slot !== undefined) {
      sync({
        type: SyncAction.ApplyItemPatch,
        patchUid,
        slot,
        targetUid
      });
      setInventory(inventory.applyItemPatch(targetUid, patchUid, slot));
      playSound("inventory_new_item_accept");
      onClose();
    }
  }

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <div className="apply-patch-overlay">
            <div className="apply-patch-container">
              <div className="apply-patch-header">
                <UseItemHeader
                  actionDesc={translate("ApplyStickerUseOn")}
                  actionItem={nameItemString(targetItem)}
                  title={translate("ApplyPatchUse")}
                  warning={translate("ApplyPatchWarn")}
                />
              </div>
              <div className="apply-patch-content">
                <div className="apply-patch-target">
                  <div className="item-image-container">
                    <ItemImage className="m-auto max-w-[512px]" item={targetItem} />
                  </div>
                </div>
                <div className="apply-patch-slots">
                  {targetItem.allPatches().map(([xslot, patchId]) =>
                    patchId !== undefined || xslot === slot ? (
                      <div
                        key={xslot}
                        className={`patch-slot ${xslot === slot ? "selected" : ""}`}
                      >
                        <ItemImage
                          className="w-[168px]"
                          item={
                            patchId !== undefined
                              ? CS2Economy.getById(patchId)
                              : stickerItem
                          }
                        />
                      </div>
                    ) : (
                      <div
                        key={xslot}
                        className="patch-slot patch-slot-empty"
                        onClick={() => {
                          setSlot(xslot);
                          playSound("buttonclick");
                        }}
                      >
                        <div className="patch-slot-add">
                          <FontAwesomeIcon className="h-4" icon={faPlus} />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="apply-patch-footer">
                <UseItemFooter
                  right={
                    <>
                      <ModalButton
                        children={translate("ApplyPatchUse")}
                        disabled={slot === undefined}
                        onClick={handleApplyPatch}
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
          </div>,
          document.body
        )
      }
    />
  );
}