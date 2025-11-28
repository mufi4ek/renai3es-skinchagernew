/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ComponentProps } from "react";

const styles = `
.settings-label-container {
  display: flex;
  height: 3rem;
  align-items: center;
  justify-content: between;
  border-radius: 8px;
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.8) 0%, rgba(30, 30, 47, 0.6) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  padding: 0.375rem 0.75rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.settings-label-container:hover {
  background: linear-gradient(145deg, rgba(26, 26, 38, 0.9) 0%, rgba(35, 35, 52, 0.7) 100%);
  border-color: rgba(58, 134, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.settings-label-text {
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
  color: #a0a0c0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  transition: color 0.3s ease;
}

.settings-label-container:hover .settings-label-text {
  color: #e2e2f0;
}
`;

export function SettingsLabel({
  label,
  ...props
}: ComponentProps<"div"> & {
  label: string;
}) {
  return (
    <>
      <style>{styles}</style>
      <div className="settings-label-container">
        <label className="settings-label-text">{label}</label>
        <div {...props} />
      </div>
    </>
  );
}