/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2Inventory } from "@ianlucas/cs2-lib";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import {
  ApiActionResyncData,
  ApiActionResyncUrl
} from "~/routes/api.action.resync._index";
import { sync } from "~/sync";
import { getJson } from "~/utils/fetch";
import { parseInventory } from "~/utils/inventory";
import { useInventory, useRules, useTranslate } from "./app-context";
import { FillSpinner } from "./fill-spinner";
import { Modal, ModalHeader } from "./modal";
import { ModalButton } from "./modal-button";

const styles = `
.sync-indicator-container {
  pointer-events: none;
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.sync-indicator-spinner {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}

.sync-error-modal {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
}

.sync-error-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.sync-error-text {
  color: #e2e2f0;
  margin-top: 0.5rem;
  padding: 0 1rem;
  text-align: center;
  line-height: 1.5;
}

.sync-error-button {
  min-width: 120px;
}

.sync-error-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sync-error-spinner {
  display: inline-block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}
`;

export function SyncIndicator() {
  const translate = useTranslate();
  const { inventoryMaxItems, inventoryStorageUnitMaxItems } = useRules();
  const [, setInventory] = useInventory();
  const [opacity, setOpacity] = useState(0);
  const [showSyncErrorModal, setShowSyncErrorModal] = useState(false);
  const [disableContinueButton, setDisableContinueButton] = useState(false);

  function handleClose() {
    setShowSyncErrorModal(false);
  }

  useEffect(() => {
    function handleSyncStart() {
      setOpacity(1);
    }
    function handleSyncEnd() {
      setOpacity(0);
    }
    async function handleSyncError() {
      setDisableContinueButton(true);
      setShowSyncErrorModal(true);
      const { syncedAt, inventory } =
        await getJson<ApiActionResyncData>(ApiActionResyncUrl);
      setInventory(
        new CS2Inventory({
          data: parseInventory(inventory),
          maxItems: inventoryMaxItems,
          storageUnitMaxItems: inventoryStorageUnitMaxItems
        })
      );
      sync.syncedAt = syncedAt;
      setDisableContinueButton(false);
    }
    sync.addEventListener("syncstart", handleSyncStart);
    sync.addEventListener("syncend", handleSyncEnd);
    sync.addEventListener("syncerror", handleSyncError);
    return () => {
      sync.removeEventListener("syncstart", handleSyncStart);
      sync.removeEventListener("syncend", handleSyncEnd);
      sync.removeEventListener("syncerror", handleSyncError);
    };
  }, []);

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{styles}</style>
            <div
              className="sync-indicator-container"
              style={{ opacity }}
            >
              <FillSpinner className="sync-indicator-spinner" />
            </div>
            {showSyncErrorModal && (
              <Modal className="sync-error-modal" fixed>
                <ModalHeader title={translate("SyncErrorTitle")} />
                <p className="sync-error-text">{translate("SyncErrorDesc")}</p>
                <div className="my-6 mt-4 flex justify-center px-4">
                  <div className="sync-error-button">
                    <ModalButton
                      disabled={disableContinueButton}
                      onClick={handleClose}
                      variant="primary"
                      children={
                        disableContinueButton ? (
                          <span className="sync-error-spinner">
                            <FillSpinner />
                          </span>
                        ) : (
                          translate("SyncErrorContinue")
                        )
                      }
                    />
                  </div>
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