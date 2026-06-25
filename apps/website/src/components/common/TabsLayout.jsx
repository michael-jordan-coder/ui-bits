import React from 'react';
import { Box, Flex, Icon, Tabs } from '@chakra-ui/react';
import { FiCode, FiEye } from 'react-icons/fi';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { colors } from '../../constants/colors';
import { useComponentPropsContext } from '../../hooks/useComponentPropsContext';
import { useOptions } from '../context/OptionsContext/useOptions';

// Single segmented control (Figma pixel-match): pill container holding both tabs.
const SEGMENT_WRAP = {
  display: 'flex',
  gap: '4px',
  p: '5px',
  bg: 'var(--chrome-toggle-bg)',
  border: '1px solid var(--chrome-toggle-border)',
  borderRadius: '9999px'
};

const SEGMENT_TAB = {
  flex: '0 0 auto',
  border: 0,
  borderRadius: '9999px',
  h: 9,
  px: 4,
  gap: 1.5,
  fontSize: '14px',
  fontWeight: 600,
  color: 'var(--text-muted)',
  justifyContent: 'center',
  alignItems: 'center',
  _selected: { bg: 'var(--chrome-toggle-active)', color: 'white' }
};

const RESET_STYLE_PROPS = {
  flex: '0 0 auto',
  border: `1px solid ${colors.borderSecondary}`,
  borderRadius: '10px',
  fontSize: '14px',
  h: 10,
  px: 4,
  color: 'white',
  justifyContent: 'center',
  _hover: { bg: colors.bgHover }
};

const TabsLayout = ({ children, className }) => {
  const { hasChanges, resetProps } = useComponentPropsContext();
  const { editorOpen, toggleEditor } = useOptions();

  const contentMap = { PreviewTab: null, CodeTab: null };
  React.Children.forEach(children, child => {
    if (!child) return;
    if (child.type === PreviewTab) contentMap.PreviewTab = child;
    if (child.type === CodeTab) contentMap.CodeTab = child;
  });

  return (
    <Tabs.Root w="100%" variant="plain" lazyMount defaultValue="preview" className={className}>
      <Tabs.List w="100%">
        <Flex
          justifyContent="flex-start"
          alignItems="center"
          gap={3}
          w="100%"
          wrap={{ base: 'wrap', md: 'nowrap' }}
        >
          <Flex {...SEGMENT_WRAP}>
            <Tabs.Trigger value="preview" {...SEGMENT_TAB}>
              <Icon as={FiEye} /> Preview
            </Tabs.Trigger>
            <Tabs.Trigger value="code" {...SEGMENT_TAB}>
              <Icon as={FiCode} /> Code
            </Tabs.Trigger>
          </Flex>

          <Box flex="1 1 auto" aria-hidden="true" />

          {hasChanges && (
            <Box
              as="button"
              aria-label="Reset to defaults"
              onClick={resetProps}
              display="flex"
              cursor="pointer"
              alignItems="center"
              justifyContent="center"
              gap={2}
              flex="0 0 auto"
              {...RESET_STYLE_PROPS}
            >
              <RotateCcw size={16} color="currentColor" /> Reset
            </Box>
          )}

          <Box
            as="button"
            type="button"
            className="editor-toggle-btn editor-toggle-btn--desktop"
            aria-label="Toggle editor panel"
            aria-pressed={editorOpen}
            onClick={toggleEditor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            flex="0 0 auto"
            h={9}
            w={9}
            borderRadius="9999px"
            bg="var(--chrome-iconbtn-bg)"
            color={editorOpen ? 'white' : 'var(--text-muted)'}
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
          </Box>
        </Flex>
      </Tabs.List>

      <Tabs.Content pt={4} value="preview">
        {contentMap.PreviewTab}
      </Tabs.Content>
      <Tabs.Content pt={4} value="code">
        {contentMap.CodeTab}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export const PreviewTab = ({ children }) => <>{children}</>;
export const CodeTab = ({ children }) => <>{children}</>;

export { TabsLayout };
