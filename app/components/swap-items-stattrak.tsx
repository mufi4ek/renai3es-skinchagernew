/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ensure } from "@ianlucas/cs2-lib";
import { createPortal } from "react-dom";
import { ClientOnly } from "remix-utils/client-only";
import { useCounter } from "~/components/hooks/use-counter";
import { useSync } from "~/components/hooks/use-sync";
import { SyncAction } from "~/data/sync";
import { useInventory, useTranslate } from "./app-context";
import { ItemImage } from "./item-image";
import { ModalButton } from "./modal-button";
import { Overlay } from "./overlay";
import { UseItemFooter } from "./use-item-footer";
import { UseItemHeader } from "./use-item-header";

const styles = `
.swap-stattrak-overlay {
  background: linear-gradient(135deg, #0a0a0f 0%, #0f0f1a 100%);
  position: relative;
  min-height: 100vh;
}

.swap-stattrak-overlay::before {
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

.swap-stattrak-container {
  background: linear-gradient(145deg, #151520 0%, #1e1e2f 100%);
  border: 1px solid #2a2a3a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}

.swap-stattrak-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
  opacity: 0.7;
}

.swap-stattrak-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.5rem;
  margin: 4rem 0;
}

.swap-stattrak-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.swap-stattrak-image {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.6));
  max-width: 256px;
}

.swap-stattrak-counter {
  position: relative;
  margin: 1rem auto 0 auto;
}

.swap-stattrak-counter-bg {
  height: 128px;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}

.swap-stattrak-counter-value {
  font-family: 'Rajdhani', sans-serif;
  position: absolute;
  top: 22%;
  width: 100%;
  text-align: center;
  font-size: 1.875rem;
  font-weight: 700;
  color: #ff6b35;
  text-shadow: 
    0 0 10px rgba(255, 107, 53, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.8);
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .swap-stattrak-content {
    flex-direction: column;
    gap: 1.5rem;
    margin: 2rem 0;
  }
  
  .swap-stattrak-image {
    max-width: 200px;
  }
  
  .swap-stattrak-counter-bg {
    height: 100px;
  }
  
  .swap-stattrak-counter-value {
    font-size: 1.5rem;
    top: 20%;
  }
}
`;

export function SwapItemsStatTrak({
  fromUid: fromUid,
  onClose,
  toUid: toUid,
  toolUid: toolUid
}: {
  fromUid: number;
  onClose: () => void;
  toUid: number;
  toolUid: number;
}) {
  const [inventory, setInventory] = useInventory();
  const translate = useTranslate();
  const sync = useSync();

  function handleAccept() {
    sync({
      type: SyncAction.SwapItemsStatTrak,
      toolUid: toolUid,
      fromUid: fromUid,
      toUid: toUid
    });
    setInventory(inventory.swapItemsStatTrak(toolUid, fromUid, toUid));
    onClose();
  }

  const toItem = inventory.get(toUid);
  const fromItem = inventory.get(fromUid);
  const to = useCounter(ensure(toItem.statTrak), ensure(fromItem.statTrak));
  const from = useCounter(ensure(fromItem.statTrak), ensure(toItem.statTrak));

  const items = [
    { item: fromItem, value: from },
    { item: toItem, value: to }
  ];

  return (
    <ClientOnly
      children={() =>
        createPortal(
          <>
            <style>{styles}</style>
            <Overlay className="swap-stattrak-overlay">
              <div className="swap-stattrak-container">
                <UseItemHeader
                  actionDesc={translate("ItemSwapStatTrakDesc")}
                  title={translate("ItemSwapStatTrakUse")}
                  warning={translate("ItemSwapStatTrakWarn")}
                />
                <div className="swap-stattrak-content">
                  {items.map(({ item, value }, index) => (
                    <div className="swap-stattrak-item" key={index}>
                      <ItemImage className="swap-stattrak-image" item={item} />
                      <div className="swap-stattrak-counter">
                        <img
                          className="swap-stattrak-counter-bg"
                          src="/images/stattrak-module.png"
                          draggable={false}
                        />
                        <span className="swap-stattrak-counter-value">
                          {String(value).padStart(6, "0")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <UseItemFooter
                  right={
                    <>
                      <ModalButton
                        variant="primary"
                        onClick={handleAccept}
                        children={translate("ItemSwapStatTrakAccept")}
                      />
                      <ModalButton
                        variant="secondary"
                        onClick={onClose}
                        children={translate("ItemSwapStatTrakClose")}
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