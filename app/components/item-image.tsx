/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CS2EconomyItem, CS2InventoryItem } from "@ianlucas/cs2-lib";
import clsx from "clsx";
import { ComponentProps, useEffect, useState } from "react";
import { isServerContext } from "~/globals";
import { noop } from "~/utils/misc";
import { FillSpinner } from "./fill-spinner";

const styles = `
.item-image-container {
  position: relative;
  display: flex;
  aspect-ratio: 256/192;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.6) 0%, rgba(30, 30, 47, 0.4) 100%);
  border-radius: 4px;
  overflow: hidden;
}

.item-image {
  aspect-ratio: 256/192;
  object-fit: contain;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.item-image:hover {
  transform: scale(1.02);
  filter: brightness(1.1) drop-shadow(0 4px 12px rgba(58, 134, 255, 0.2));
}

.loading-spinner {
  opacity: 0.6;
  color: #3a86ff;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.7) 0%, rgba(15, 15, 25, 0.5) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.image-placeholder {
  background: linear-gradient(45deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border: 1px solid rgba(42, 42, 58, 0.4);
  border-radius: 4px;
}
`;

let cached: string[] = [];

export function ItemImage({
  className,
  item,
  lazy,
  onLoad,
  type,
  wear,
  ...props
}: Omit<ComponentProps<"img">, "onLoad"> & {
  item: CS2EconomyItem | CS2InventoryItem;
  lazy?: boolean;
  onLoad?: () => void;
  type?: "default" | "collection" | "specials";
  wear?: number;
}) {
  type ??= "default";
  const url =
    type === "default"
      ? item.getImage(wear)
      : type === "collection"
        ? item.getCollectionImage()
        : item.getSpecialsImage();

  const [loaded, setLoaded] = useState(
    cached.includes(url) || url.includes("steamcommunity")
  );

  useEffect(() => {
    if (!loaded) {
      let controller: AbortController | undefined = undefined;
      function fetchImage() {
        controller = new AbortController();
        fetch(url, { signal: controller?.signal })
          .then(() => {
            controller = undefined;
            setLoaded(true);
            if (!isServerContext) {
              cached.push(url);
            }
          })
          .catch(noop);
      }
      const idx = setTimeout(fetchImage, lazy ? 16 : 1);
      return () => {
        clearTimeout(idx);
        controller?.abort();
      };
    }
  }, [lazy, loaded]);

  useEffect(() => {
    if (loaded) {
      onLoad?.();
    }
  }, [loaded]);

  const content = loaded ? (
    <img
      alt={item.name}
      draggable={false}
      src={url}
      {...props}
      className={clsx("item-image", className)}
    />
  ) : (
    <div
      {...props}
      className={clsx("item-image-container image-placeholder", className)}
    >
      <div className="loading-overlay">
        <FillSpinner className="loading-spinner" />
      </div>
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      {content}
    </>
  );
}