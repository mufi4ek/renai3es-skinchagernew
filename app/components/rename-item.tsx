/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faCheck, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { CS2Economy } from "@ianlucas/cs2-lib";
import { useToggle } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useInput } from "~/components/hooks/use-input";
import { useInventoryItem } from "~/components/hooks/use-inventory-item";
import { useNameItemString } from "~/components/hooks/use-name-item";
import { useSync } from "~/components/hooks/use-sync";
import { SyncAction } from "~/data/sync";
import { playSound } from "~/utils/sound";
import { useInventory, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { ModalButton } from "./modal-button";
import { Overlay } from "./overlay";
import { ToolButton } from "./tool-button";
import { ToolInput } from "./tool-input";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const styles = `
.rename-item-overlay {
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  position: relative;
  min-height: 100vh;
}

.rename-item-overlay::before {
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

.rename-item-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

.rename-item-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.7;
}

.rename-item-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

.rename-item-input {
  background: rgba(26, 26, 38, 0.8);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #e2e2f0;
  font-size: 1.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rename-item-input:focus {
  outline: none;
  border-color: #3a86ff;
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4);
}

.rename-item-input::placeholder {
  color: #6b6b8a;
}

.rename-item-image {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6));
  margin: 2rem auto;
  max-width: 512px;
}

.rename-item-tool-button {
  background: linear-gradient(145deg, #1a1a2a 0%, #23233a 100%);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #a0a0c0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rename-item-tool-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #23233a 0%, #2a2a42 100%);
  border-color: #3a3a5a;
  color: #3a86ff;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.rename-item-tool-button:active:not(:disabled) {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.rename-item-tool-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

export function RenameItem({
  onClose,
  targetUid,
  toolUid
}: {
  onClose: () => void;
  targetUid: number;
  toolUid: number;
}) {
  const translate = useTranslate();
  const sync = useSync();
  const nameItemString = useNameItemString();
  const [inventory, setInventory] = useInventory();
  const [nameTag, setNameTag] = useInput("");
  const [isConfirmed, toggleIsConfirmed] = useToggle();

  const inventoryItem = useInventoryItem(targetUid);
  const isInvalid = !CS2Economy.safeValidateNametag(nameTag);
  const isConfirmDisabled = nameTag.length === 0;

  function handleRename() {
    if (targetUid < 0 && inventoryItem.free) {
      playSound("inventory_new_item_accept");
      sync({
        type: SyncAction.AddWithNametag,
        toolUid: toolUid,
        itemId: inventoryItem.id,
        nameTag: nameTag
      });
      setInventory(
        inventory.addWithNametag(toolUid, inventoryItem.id, nameTag)
      );
    } else {
      sync({
        type: SyncAction.RenameItem,
        toolUid: toolUid,
        targetUid: targetUid,
        nameTag: nameTag
      });
      setInventory(inventory.renameItem(toolUid, targetUid, nameTag));
    }

    onClose();
  }

  function handleToggleConfirm() {
    toggleIsConfirmed();
  }

  useEffect(() => {
    if (!isConfirmed) {
      setNameTag("");
    }
  }, [isConfirmed]);

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{styles}</style>
            <Overlay className="rename-item-overlay">
              <div className="rename-item-container">
                <UseItemHeader
                  actionDesc={translate("RenameEnterName")}
                  actionItem={nameItemString(inventoryItem)}
                  title={translate("RenameUse")}
                  warning={translate("RenameWarn")}
                />
                <ItemImage
                  className="rename-item-image"
                  item={inventoryItem}
                />
                <div className="rename-item-input-container">
                  <ToolInput
                    autoFocus
                    className="rename-item-input text-2xl lg:max-w-[428px]"
                    maxLength={20}
                    onChange={setNameTag}
                    placeholder={translate("InventoryItemRenamePlaceholder")}
                    validate={(nameTag) =>
                      CS2Economy.safeValidateNametag(nameTag ?? "")
                    }
                    value={nameTag}
                  />
                  <ToolButton
                    onClick={handleToggleConfirm}
                    icon={isConfirmed ? faCircleXmark : faCheck}
                    isBorderless={isConfirmed}
                    disabled={isConfirmDisabled}
                    tooltip={
                      isConfirmDisabled || isInvalid
                        ? translate("InventoryItemRenameInvalidTooltip")
                        : isConfirmed
                          ? translate("InventoryItemRenameClearTooltip")
                          : undefined
                    }
                    className="rename-item-tool-button"
                  />
                </div>
                <UseItemFooter
                  right={
                    <>
                      <ModalButton
                        disabled={
                          (nameTag !== "" && isInvalid) ||
                          (nameTag === "" && inventoryItem.free) ||
                          !isConfirmed
                        }
                        variant="primary"
                        onClick={handleRename}
                        children={translate("RenameRename")}
                      />
                      <ModalButton
                        variant="secondary"
                        onClick={onClose}
                        children={translate("RenameCancel")}
                      />
                    </>
                  }
                />
              </div>
            </Overlay>
          </>,
          document.body
        )
      }
    />
  );
}