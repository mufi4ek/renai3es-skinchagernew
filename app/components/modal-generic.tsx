/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ReactNode } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { Modal, ModalHeader } from "./modal";
import {ModalButton} from "./modal-button";

const styles = `
.generic-modal-content {
  padding: 1rem;
}

.generic-modal-body {
  font-size: 0.875rem;
  color: #e2e2f0;
  line-height: 1.5;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-top: 0.5rem;
  padding: 0 1rem;
}

.generic-modal-body.preformatted {
  white-space: pre-wrap;
}

.generic-modal-actions {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0 1rem;
}

.generic-modal-button {
  min-width: 100px;
  transition: all 0.3s ease;
}

.generic-modal-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.generic-modal-button:active {
  transform: translateY(0);
}
`;

function GenericModalShell({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{styles}</style>
      {children}
    </>
  );
}

export async function alert({
  titleText,
  bodyText,
  closeText
}: {
  titleText: string;
  bodyText: string;
  closeText: string;
}) {
  const root = createRoot(document.createElement("div"));
  root.render(
    createPortal(
      <GenericModalShell>
        <Modal className="w-[550px]" fixed>
          <ModalHeader title={titleText} />
          <p className="generic-modal-body">{bodyText}</p>
          <div className="generic-modal-actions">
            <div className="generic-modal-button">
              <ModalButton
                onClick={() => root.unmount()}
                variant="secondary"
              >
                {closeText}
              </ModalButton>
            </div>
          </div>
        </Modal>
      </GenericModalShell>,
      document.body
    )
  );
}

export async function confirm({
  bodyText,
  cancelText,
  confirmText,
  titleText
}: {
  bodyText: string;
  cancelText: string;
  confirmText: string;
  titleText: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const root = createRoot(document.createElement("div"));
    root.render(
      createPortal(
        <GenericModalShell>
          <Modal className="w-[550px]" fixed blur>
            <ModalHeader title={titleText} />
            <p className="generic-modal-body">{bodyText}</p>
            <div className="generic-modal-actions">
              <div className="generic-modal-button">
                <ModalButton
                  onClick={() => {
                    root.unmount();
                    resolve(false);
                  }}
                  variant="secondary"
                >
                  {cancelText}
                </ModalButton>
              </div>
              <div className="generic-modal-button">
                <ModalButton
                  onClick={() => {
                    root.unmount();
                    resolve(true);
                  }}
                  variant="primary"
                >
                  {confirmText}
                </ModalButton>
              </div>
            </div>
          </Modal>
        </GenericModalShell>,
        document.body
      )
    );
  });
}