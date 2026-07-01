import { useQueryStates } from 'nuqs';
import { useCallback, useMemo, useRef } from 'react';

const isHexColor = value => typeof value === 'string' && /^#?[0-9a-fA-F]{3,8}$/.test(value);

const makeParser = (parse, serialize = v => String(v)) => ({
  parse: v => (v === null || v === '' ? null : parse(v)),
  serialize,
  eq: (a, b) => a === b
});

const createParser = defaultValue => {
  if (typeof defaultValue === 'number') return makeParser(Number);
  if (typeof defaultValue === 'boolean') return makeParser(v => v === 'true');
  if (isHexColor(defaultValue)) return makeParser(v => `#${v}`, v => v.replace(/^#/, ''));
  return makeParser(v => v);
};

export function useComponentProps(defaultProps) {
  const defaultPropsRef = useRef(defaultProps);

  const parsers = useMemo(() => {
    const result = {};
    for (const [key, defaultValue] of Object.entries(defaultPropsRef.current)) {
      result[key] = createParser(defaultValue);
    }
    return result;
  }, []);

  const [queryState, setQueryState] = useQueryStates(parsers);

  const props = useMemo(() => {
    const merged = { ...defaultPropsRef.current };
    for (const [key, value] of Object.entries(queryState)) {
      if (value !== null) merged[key] = value;
    }
    return merged;
  }, [queryState]);

  const hasChanges = useMemo(() => Object.values(queryState).some(v => v !== null), [queryState]);

  const updateProp = useCallback(
    (name, value) => {
      const newValue = value === defaultPropsRef.current[name] ? null : value;
      setQueryState({ [name]: newValue });
    },
    [setQueryState]
  );

  const resetProps = useCallback(() => {
    const resetState = {};
    for (const key of Object.keys(defaultPropsRef.current)) {
      resetState[key] = null;
    }
    setQueryState(resetState);
  }, [setQueryState]);

  return {
    props,
    defaultProps: defaultPropsRef.current,
    updateProp,
    resetProps,
    hasChanges
  };
}

export default useComponentProps;
