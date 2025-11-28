/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState
} from "react";
import { ClientOnly } from "remix-utils/client-only";
import { useWatch } from "~/components/hooks/use-watch";
import { TransformedInventoryItems } from "~/utils/inventory-transform";

const styles = `
.item-selector-overlay {
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.98) 0%, rgba(15, 15, 25, 0.95) 100%);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(42, 42, 58, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.item-selector-content {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.9) 0%, rgba(30, 30, 47, 0.8) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.item-selector-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.item-selector-scroll {
  scroll-behavior: smooth;
}
`;

export interface ItemSelectorContextProps {
  items: TransformedInventoryItems;
  readOnly?: boolean;
  type:
    | "apply-item-patch"
    | "apply-item-sticker"
    | "deposit-to-storage-unit"
    | "inspect-storage-unit"
    | "rename-item"
    | "retrieve-from-storage-unit"
    | "scrape-sticker"
    | "swap-items-stattrak"
    | "unlock-case";
  uid: number;
}

const ItemSelectorContext = createContext<{
  itemSelector: ItemSelectorContextProps | undefined;
  setItemSelector: Dispatch<
    SetStateAction<ItemSelectorContextProps | undefined>
  >;
}>(null!);

export function useItemSelectorContext() {
  return useContext(ItemSelectorContext);
}

export function useItemSelector() {
  const { itemSelector, setItemSelector } = useItemSelectorContext();
  return [itemSelector, setItemSelector] as const;
}

export function useItemSelectorScrollTopHandler<T>(dependency: T) {
  useWatch((oldState, newState) => {
    if (
      (oldState === undefined && newState !== undefined) ||
      (oldState !== undefined && newState === undefined)
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, dependency);
}

export function ItemSelectorProvider({ children }: { children: ReactNode }) {
  const [itemSelector, setItemSelector] = useState<ItemSelectorContextProps>();
  useItemSelectorScrollTopHandler(itemSelector);

  return (
    <>
      <style>{styles}</style>
      <ClientOnly
        children={() => (
          <ItemSelectorContext.Provider
            value={{
              itemSelector,
              setItemSelector
            }}
          >
            {children}
          </ItemSelectorContext.Provider>
        )}
      />
    </>
  );
}