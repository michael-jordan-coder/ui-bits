import { useMemo } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useOptions } from '../context/OptionsContext/useOptions';
import { useComponentPropsContext } from '../../hooks/useComponentPropsContext';
import CodeHighlighter from './CodeHighlighter';
import { colors } from '../../constants/colors';

const STYLE_OPTIONS = [
  { value: 'CSS', label: 'CSS' },
  { value: 'TW', label: 'Tailwind' }
];

const StyleToggle = ({ value, onChange }) => (
  <Flex
    role="tablist"
    aria-label="Styling"
    gap={1}
    p={1}
    border={`1px solid ${colors.borderSecondary}`}
    borderRadius="10px"
    w="fit-content"
  >
    {STYLE_OPTIONS.map(opt => {
      const selected = value === opt.value;
      return (
        <Box
          key={opt.value}
          as="button"
          role="tab"
          aria-selected={selected}
          onClick={() => onChange(opt.value)}
          cursor="pointer"
          fontSize="13px"
          fontWeight={500}
          lineHeight="1"
          px={3}
          py="6px"
          borderRadius="7px"
          bg={selected ? colors.bgElevated : 'transparent'}
          color={selected ? colors.accent : colors.textMuted}
          _hover={selected ? {} : { bg: colors.bgHover }}
        >
          {opt.label}
        </Box>
      );
    })}
  </Flex>
);

function injectPropsIntoCode(usageCode, props, defaultProps, componentName, demoOnlyProps = []) {
  if (!usageCode || !props || !componentName) return usageCode;

  const demoOnlySet = new Set(demoOnlyProps);
  const changedProps = {};
  for (const [key, value] of Object.entries(props)) {
    if (demoOnlySet.has(key)) continue;
    if (JSON.stringify(value) !== JSON.stringify(defaultProps[key])) {
      changedProps[key] = value;
    }
  }

  if (Object.keys(changedProps).length === 0) return usageCode;

  let result = usageCode;
  for (const [propName, propValue] of Object.entries(changedProps)) {
    const formatted =
      typeof propValue === 'string' ? `"${propValue}"` : `{${JSON.stringify(propValue)}}`;
    const replacement =
      typeof propValue === 'boolean' && propValue === true ? propName : `${propName}=${formatted}`;

    const re = new RegExp(`(^[ \\t]*)(${propName})(?:=(?:"[^"\\n]*"|\\{[^{}\\n]*\\}|[^\\s/>]+))?[ \\t]*(\\r?\\n|$)`, 'gm');
    if (re.test(result)) {
      re.lastIndex = 0;
      let seen = false;
      result = result.replace(re, (_match, indent, _name, lineEnding) => {
        if (seen) return '';
        seen = true;
        return `${indent}${replacement}${lineEnding}`;
      });
    }
  }
  return result;
}

const pickSnippet = (codeObject, lang, style) => {
  if (lang === 'TS' && style === 'TW' && codeObject.tsTailwind) return { source: codeObject.tsTailwind, language: 'tsx' };
  if (lang === 'TS' && codeObject.tsCode) return { source: codeObject.tsCode, language: 'tsx' };
  if (style === 'TW' && codeObject.tailwind) return { source: codeObject.tailwind, language: 'jsx' };
  return { source: codeObject.code || '', language: 'jsx' };
};

const CodeExample = ({ codeObject, componentName }) => {
  const { languagePreset, stylePreset, setStylePreset } = useOptions();
  const { props, demoOnlyProps, computedProps } = useComponentPropsContext();

  const dynamicUsage = useMemo(() => {
    if (!codeObject?.usage || !componentName || !props) return codeObject?.usage || '';
    const merged = { ...props, ...computedProps };
    return injectPropsIntoCode(codeObject.usage, merged, {}, componentName, demoOnlyProps);
  }, [codeObject, props, computedProps, componentName, demoOnlyProps]);

  if (!codeObject) return null;

  const { source, language } = pickSnippet(codeObject, languagePreset, stylePreset);

  return (
    <>
      <Box mb={5}>
        <StyleToggle value={stylePreset} onChange={setStylePreset} />
      </Box>

      {codeObject.dependencies && (
        <Box mb={4}>
          <h2 className="demo-title">Install</h2>
          <CodeHighlighter
            language="bash"
            codeString={`npm install ${codeObject.dependencies}`}
            showLineNumbers={false}
          />
        </Box>
      )}

      {dynamicUsage && (
        <Box>
          <h2 className="demo-title">Usage</h2>
          <CodeHighlighter language="tsx" codeString={dynamicUsage} />
        </Box>
      )}

      <Box mt={6}>
        <h2 className="demo-title">
          Component{' '}
          <span style={{ color: colors.accent, fontSize: '12px' }}>
            ({languagePreset} + {stylePreset})
          </span>
        </h2>
        <CodeHighlighter language={language} codeString={source} />
      </Box>

      {codeObject.css && stylePreset === 'CSS' && (
        <Box mt={6}>
          <h2 className="demo-title">CSS</h2>
          <CodeHighlighter language="css" codeString={codeObject.css} />
        </Box>
      )}
    </>
  );
};

export default CodeExample;
