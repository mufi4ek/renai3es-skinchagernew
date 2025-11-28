/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const styles = `
.context-divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(90deg, transparent, rgba(42, 42, 58, 0.8), transparent);
  margin: 0.25rem 0;
  border: none;
}
`;

export function ContextDivider() {
  return (
    <>
      <style>{styles}</style>
      <div className="context-divider" />
    </>
  );
}
