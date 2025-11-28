/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CS2_MAX_STICKER_ROTATION,
  CS2_MAX_STICKER_WEAR,
  CS2_MIN_STICKER_ROTATION,
  CS2_MIN_STICKER_WEAR,
  CS2_STICKER_WEAR_FACTOR,
  CS2EconomyItem
} from "@ianlucas/cs2-lib";
import {
  generateInspectLink,
  isCommandInspect
} from "@ianlucas/cs2-lib-inspect";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import clsx from "clsx";
import { useEffect } from "react";
import {
  maxStickerOffset,
  minStickerOffset,
  stickerOffsetFactor,
  stickerOffsetStringMaxLen,
  stickerOffsetToString,
  stickerRotationStringMaxLen,
  stickerWearStringMaxLen,
  stickerWearToString,
  validateStickerOffset,
  validateStickerRotation,
  validateStickerWear
} from "~/utils/economy";
import { createFakeInventoryItemFromBase } from "~/utils/inventory";
import { useTranslate } from "./app-context";
import { ButtonWithTooltip } from "./button-with-tooltip";
import { EditorItemDisplay } from "./editor-item-display";
import { EditorLabel } from "./editor-label";
import { EditorStepRangeWithInput } from "./editor-step-range-with-input";
import { useKeyValues } from "./hooks/use-key-values";
import { useTimedState } from "./hooks/use-timed-state";

const appliedStickerStyles = `
.applied-sticker-editor {
  background: linear-gradient(145deg, #151520 0%, #1a1a2a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.applied-sticker-editor::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.3), transparent);
}

.applied-sticker-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.applied-sticker-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.applied-sticker-preview-btn {
  background: linear-gradient(135deg, #1a1a2a 0%, #151520 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.applied-sticker-preview-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(58, 134, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.applied-sticker-preview-btn:hover::before {
  left: 100%;
}

.applied-sticker-preview-btn:hover {
  background: linear-gradient(135deg, #202036 0%, #1a1a2a 100%);
  border-color: rgba(58, 134, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(58, 134, 255, 0.1);
}

.applied-sticker-preview-btn:active {
  transform: translateY(0);
  transition-duration: 0.1s;
}

.applied-sticker-preview-btn.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: rgba(16, 185, 129, 0.3);
}

.applied-sticker-preview-btn.success:hover {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  border-color: rgba(16, 185, 129, 0.5);
}

.applied-sticker-icon {
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.applied-sticker-preview-btn:hover .applied-sticker-icon {
  filter: drop-shadow(0 0 6px rgba(58, 134, 255, 0.4));
}

.applied-sticker-preview-btn.success .applied-sticker-icon {
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.4));
}

@keyframes buttonPulse {
  0%, 100% {
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.4),
      0 0 0 1px rgba(58, 134, 255, 0.1);
  }
  50% {
    box-shadow: 
      0 4px 20px rgba(58, 134, 255, 0.15),
      0 0 0 1px rgba(58, 134, 255, 0.2);
  }
}

.applied-sticker-preview-btn:hover {
  animation: buttonPulse 2s infinite;
}

.applied-sticker-preview-btn.success:hover {
  animation: none;
}
`;

export function AppliedStickerEditor({
  className,
  forItem,
  isHideStickerRotation,
  isHideStickerWear,
  isHideStickerX,
  isHideStickerY,
  item,
  onChange,
  slot,
  stickers,
  value
}: {
  className?: string;
  forItem?: CS2EconomyItem;
  isHideStickerRotation?: boolean;
  isHideStickerWear?: boolean;
  isHideStickerX?: boolean;
  isHideStickerY?: boolean;
  item: CS2EconomyItem;
  onChange?: (data: {
    rotation: number;
    wear: number;
    x: number;
    y: number;
  }) => void;
  slot?: number;
  stickers?: Record<
    string,
    { wear?: number; rotation?: number; x?: number; y?: number }
  >;
  value: { wear: number; rotation: number; x: number; y: number };
}) {
  const translate = useTranslate();
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, triggerCopied] = useTimedState();

  const attributes = useKeyValues(value);
  const isDisabled = false;
  const canPreviewItem =
    slot !== undefined && forItem !== undefined && stickers !== undefined;

  function handlePreview() {
    if (!canPreviewItem) {
      return;
    }

    const preview = {
      id: forItem.id,
      stickers: {
        ...stickers,
        [slot]: { id: item.id, ...attributes.value }
      }
    };
    const inspectLink = generateInspectLink(
      createFakeInventoryItemFromBase(preview)
    );
    const isCommand = isCommandInspect(inspectLink);
    copyToClipboard(inspectLink);
    if (isCommand) {
      triggerCopied();
    } else {
      window.location.assign(inspectLink);
    }
  }

  useEffect(() => {
    onChange?.(attributes.value);
  }, [attributes.value]);

  return (
    <>
      <style>{appliedStickerStyles}</style>
      <div className={clsx("applied-sticker-editor m-auto select-none", className)}>
        <div className="applied-sticker-content">
          <EditorItemDisplay item={item} wear={attributes.value.wear} />
          <div className="applied-sticker-controls">
            {!isHideStickerWear && (
              <EditorLabel label={translate("EditorWear")}>
                <EditorStepRangeWithInput
                  inputStyles="w-24 min-w-0"
                  max={CS2_MAX_STICKER_WEAR}
                  maxLength={stickerWearStringMaxLen}
                  min={CS2_MIN_STICKER_WEAR}
                  onChange={attributes.update("wear")}
                  randomizable
                  step={CS2_STICKER_WEAR_FACTOR}
                  stepRangeStyles="flex-1"
                  transform={stickerWearToString}
                  type="float"
                  validate={validateStickerWear}
                  value={attributes.value.wear}
                />
              </EditorLabel>
            )}
            {!isHideStickerX && (
              <EditorLabel label={translate("EditorStickerX")}>
                <EditorStepRangeWithInput
                  inputStyles="w-24 min-w-0"
                  max={maxStickerOffset}
                  maxLength={stickerOffsetStringMaxLen}
                  min={minStickerOffset}
                  onChange={attributes.update("x")}
                  randomizable
                  step={stickerOffsetFactor}
                  stepRangeStyles="flex-1"
                  transform={stickerOffsetToString}
                  type="float"
                  validate={validateStickerOffset}
                  value={attributes.value.x}
                />
              </EditorLabel>
            )}
            {!isHideStickerY && (
              <EditorLabel label={translate("EditorStickerY")}>
                <EditorStepRangeWithInput
                  inputStyles="w-24 min-w-0"
                  max={maxStickerOffset}
                  maxLength={stickerOffsetStringMaxLen}
                  min={minStickerOffset}
                  onChange={attributes.update("y")}
                  randomizable
                  step={stickerOffsetFactor}
                  stepRangeStyles="flex-1"
                  transform={stickerOffsetToString}
                  type="float"
                  validate={validateStickerOffset}
                  value={attributes.value.y}
                />
              </EditorLabel>
            )}
            {!isHideStickerRotation && (
              <EditorLabel label={translate("EditorStickerRotation")}>
                <EditorStepRangeWithInput
                  inputStyles="w-24 min-w-0"
                  max={CS2_MAX_STICKER_ROTATION}
                  maxLength={stickerRotationStringMaxLen}
                  min={CS2_MIN_STICKER_ROTATION}
                  onChange={attributes.update("rotation")}
                  randomizable
                  step={1}
                  stepRangeStyles="flex-1"
                  type="int"
                  validate={validateStickerRotation}
                  value={attributes.value.rotation}
                />
              </EditorLabel>
            )}
            <div className="flex justify-end">
              <button
                className={clsx(
                  "applied-sticker-preview-btn flex items-center gap-2",
                  copied && "success"
                )}
                onClick={handlePreview}
                disabled={!canPreviewItem}
              >
                <FontAwesomeIcon 
                  icon={faEye} 
                  className="applied-sticker-icon h-4" 
                />
                <span className="text-sm font-medium">
                  {translate(
                    copied ? "EditorCopiedToClipboard" : "EditorPreview"
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}