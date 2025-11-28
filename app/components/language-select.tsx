/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Ian Lucas. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ComponentProps } from "react";
import { LanguageName } from "~/data/languages";
import { useTranslate } from "./app-context";
import { Select } from "./select";

const styles = `
.language-select {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.9) 0%, rgba(30, 30, 47, 0.8) 100%);
  border: 1px solid rgba(42, 42, 58, 0.6);
  border-radius: 6px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.language-select:hover {
  border-color: rgba(58, 134, 255, 0.4);
  box-shadow: 0 4px 16px rgba(58, 134, 255, 0.2);
}

.language-select:focus-within {
  border-color: #3a86ff;
  box-shadow: 0 0 0 2px rgba(58, 134, 255, 0.2);
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  color: #e2e2f0;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.language-option:hover {
  background: rgba(58, 134, 255, 0.1);
  color: #3a86ff;
}

.language-flag {
  height: 16px;
  width: 24px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.language-label {
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.language-dropdown {
  background: linear-gradient(145deg, rgba(21, 21, 32, 0.98) 0%, rgba(30, 30, 47, 0.95) 100%);
  border: 1px solid rgba(42, 42, 58, 0.8);
  border-radius: 6px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  max-height: 300px;
  overflow-y: auto;
}

.language-dropdown::-webkit-scrollbar {
  width: 6px;
}

.language-dropdown::-webkit-scrollbar-track {
  background: rgba(15, 15, 25, 0.4);
  border-radius: 3px;
}

.language-dropdown::-webkit-scrollbar-thumb {
  background: rgba(58, 134, 255, 0.4);
  border-radius: 3px;
}

.language-dropdown::-webkit-scrollbar-thumb:hover {
  background: rgba(58, 134, 255, 0.6);
}
`;

export function LanguageSelect({
  languages,
  onChange,
  value
}: {
  languages: {
    name: LanguageName;
    country: string;
  }[];
} & Omit<ComponentProps<typeof Select>, "children" | "options">) {
  const translate = useTranslate();

  return (
    <>
      <style>{styles}</style>
      <Select
        value={value}
        onChange={onChange}
        options={languages.map(({ name, country }) => ({
          flag: country.toUpperCase(),
          label: translate(`Language$${name}`),
          value: name
        }))}
        className="language-select"
        children={({ flag, label }) => (
          <div className="language-option">
            <img
              src={`/images/flags/${flag}.svg`}
              className="language-flag"
              alt={label}
              title={label}
              draggable={false}
            />
            <span className="language-label">{label}</span>
          </div>
        )}
      />
    </>
  );
}