/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
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
import { useInventory, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { ModalButton } from "./modal-button";
import { Overlay } from "./overlay";
import { ToolButton } from "./tool-button";
import { ToolInput } from "./tool-input";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const styles = `
.rename-storage-unit-overlay {
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  position: relative;
  min-height: 100vh;
}

.rename-storage-unit-overlay::before {
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

.rename-storage-unit-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

.rename-storage-unit-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.7;
}

.rename-storage-unit-input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 2rem auto;
  padding: 0 1rem;
}

.rename-storage-unit-input {
  background: rgba(26, 26, 38, 0.8);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #e2e2f0;
  font-size: 1.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rename-storage-unit-input:focus {
  outline: none;
  border-color: #3a86ff;
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.4);
}

.rename-storage-unit-input::placeholder {
  color: #6b6b8a;
}

.rename-storage-unit-image {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6));
  margin: 2rem auto;
  max-width: 512px;
}

.rename-storage-unit-tool-button {
  background: linear-gradient(145deg, #1a1a2a 0%, #23233a 100%);
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  color: #a0a0c0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.rename-storage-unit-tool-button:hover:not(:disabled) {
  background: linear-gradient(145deg, #23233a 0%, #2a2a42 100%);
  border-color: #3a3a5a;
  color: #3a86ff;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}

.rename-storage-unit-tool-button:active:not(:disabled) {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.rename-storage-unit-tool-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

export function RenameStorageUnit({
  onClose,
  uid
}: {
  onClose: () => void;
  uid: number;
}) {
  const [inventory, setInventory] = useInventory();
  const translate = useTranslate();
  const sync = useSync();
  const nameItemString = useNameItemString();

  const item = useInventoryItem(uid);
  const { nameTag: defaultValue } = item;
  const isStartUsingStorageUnit = defaultValue === undefined;
  const [nameTag, setNameTag] = useInput(defaultValue ?? "");
  const [isConfirmed, toggleIsConfirmed] = useToggle();

  const isConfirmDisabled = nameTag.length === 0;
  const isInvalid = !CS2Economy.safeValidateNametag(nameTag);

  function handleRename() {
    sync({
      type: SyncAction.RenameStorageUnit,
      uid: uid,
      nameTag: nameTag
    });
    setInventory(inventory.renameStorageUnit(uid, nameTag));
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
            <Overlay className="rename-storage-unit-overlay">
              <div className="rename-storage-unit-container">
                <UseItemHeader
                  actionDesc={translate("RenameStorageUnitEnterName")}
                  actionItem={nameItemString(item)}
                  title={translate("RenameStorageUnitUse")}
                  warning={
                    isStartUsingStorageUnit
                      ? translate("RenameStorageUnitFirstNameWarn")
                      : translate("RenameStorageUnitNewNameWarn")
                  }
                />
                <ItemImage
                  className="rename-storage-unit-image"
                  item={item}
                />
                <div className="rename-storage-unit-input-container">
                  <ToolInput
                    autoFocus
                    className="rename-storage-unit-input text-2xl lg:max-w-[428px]"
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
                    className="rename-storage-unit-tool-button"
                  />
                </div>
                <UseItemFooter
                  right={
                    <>
                      <ModalButton
                        disabled={nameTag === "" || isInvalid || !isConfirmed}
                        variant="primary"
                        onClick={handleRename}
                        children={translate("RenameStorageUnitRename")}
                      />
                      <ModalButton
                        variant="secondary"
                        onClick={onClose}
                        children={translate("RenameStorageUnitClose")}
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