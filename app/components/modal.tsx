/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ComponentRef, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router";
import { ClientOnly } from "remix-utils/client-only";

const styles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 200;
  display: flex;
  min-height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 25, 0.9) 100%);
  backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.modal-overlay.hidden {
  display: none;
}

.modal-overlay.animate {
  opacity: 0;
}

.modal-container {
  border-radius: 12px;
  border: 1px solid rgba(42, 42, 58, 0.8);
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.98) 0%, rgba(30, 30, 47, 0.95) 100%);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(58, 134, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #e2e2f0;
  position: relative;
  overflow: hidden;
}

.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #3a86ff, transparent);
}

.modal-header {
  background: linear-gradient(135deg, rgba(21, 21, 32, 0.9) 0%, rgba(30, 30, 47, 0.8) 100%);
  border-bottom: 1px solid rgba(42, 42, 58, 0.6);
  padding: 0.75rem 1rem;
  user-select: none;
}

.modal-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

.modal-close-button {
  display: flex;
  height: 2rem;
  width: 2rem;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: rgba(42, 42, 58, 0.6);
  border: 1px solid rgba(42, 42, 58, 0.8);
  color: #a0a0c0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.modal-close-button:hover {
  background: rgba(58, 134, 255, 0.2);
  border-color: rgba(58, 134, 255, 0.4);
  color: #3a86ff;
  transform: scale(1.05);
}

.modal-close-button:active {
  transform: scale(0.95);
}
`;

export function Modal({
  blur,
  children,
  className,
  fixed,
  hidden
}: {
  blur?: boolean;
  children: ReactNode;
  className?: string;
  fixed?: boolean;
  hidden?: boolean;
}) {
  const ref = useRef<ComponentRef<"div">>(null);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    requestAnimationFrame(() => setAnimate(hidden ? true : false));
  }, [hidden]);

  return (
    <>
      <style>{styles}</style>
      <ClientOnly
        children={() =>
          createPortal(
            <div
              className={clsx(
                "modal-overlay",
                hidden ? "hidden" : fixed ? "fixed" : "absolute",
                animate && "animate"
              )}
              ref={ref}
            >
              <div
                className={clsx(
                  "modal-container",
                  className
                )}
              >
                {children}
              </div>
            </div>,
            document.body
          )
        }
      />
    </>
  );
}

export function ModalHeader({
  linkTo,
  onClose,
  title
}: {
  linkTo?: string;
  onClose?: () => void;
  title: string;
}) {
  return (
    <div className="modal-header">
      <div className="flex items-center justify-between">
        <span className="modal-title">
          {title}
        </span>
        <div className="flex items-center gap-1">
          {linkTo !== undefined && (
            <Link
              className="modal-close-button"
              to={linkTo}
            >
              <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
            </Link>
          )}
          {onClose !== undefined && (
            <button
              className="modal-close-button"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}