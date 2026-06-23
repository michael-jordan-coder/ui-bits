/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useEffect, useState } from 'react';

export const OptionsContext = createContext(null);

export function OptionsProvider({ children }) {
  // The site is TS-only: JS variants still ship in the registry but are never
  // shown. Language is locked to 'TS'; only the styling choice is user-toggleable.
  const languagePreset = 'TS';
  const [stylePreset, setStylePreset] = useState('CSS');
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    const storedStyle = localStorage.getItem('preferredStyle');
    if (storedStyle === 'CSS' || storedStyle === 'TW') setStylePreset(storedStyle);
  }, []);

  useEffect(() => {
    localStorage.setItem('preferredStyle', stylePreset);
  }, [stylePreset]);

  const toggleStyle = useCallback(() => {
    setStylePreset(prev => (prev === 'CSS' ? 'TW' : 'CSS'));
  }, []);

  const toggleEditor = useCallback(() => {
    setEditorOpen(prev => !prev);
  }, []);

  return (
    <OptionsContext.Provider
      value={{
        languagePreset,
        stylePreset,
        setStylePreset,
        toggleStyle,
        editorOpen,
        setEditorOpen,
        toggleEditor
      }}
    >
      {children}
    </OptionsContext.Provider>
  );
}
