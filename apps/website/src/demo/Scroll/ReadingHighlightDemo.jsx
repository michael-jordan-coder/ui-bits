import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ReadingHighlight from '../../content/Scroll/ReadingHighlight/ReadingHighlight';
import { readingHighlight } from '../../constants/code/Scroll/readingHighlightCode';

const SAMPLE_TEXT =
  'Good software starts as a small honest idea and grows one careful decision at a time. You read each line slowly, let the meaning settle, and only then move on to the next thought.';

const DEFAULT_PROPS = {
  height: 460
};

const ReadingHighlightDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'text',
        type: 'string',
        default: "'Good software starts…'",
        description: 'Paragraph to sweep through, split on whitespace into words.'
      },
      { name: 'dim', type: 'string', default: "'#3a3f4b'", description: 'Color of a word before the highlight reaches it.' },
      { name: 'bright', type: 'string', default: "'#f5f7fa'", description: 'Color of a word once the highlight lands on it.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={readingHighlight}
      componentName="ReadingHighlight"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ReadingHighlight key={key} text={SAMPLE_TEXT} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <PreviewSlider
            title="Height"
            min={320}
            max={620}
            value={props.height}
            valueUnit="px"
            onChange={val => set('height', val)}
          />
        );
      }}
    />
  );
};

export default ReadingHighlightDemo;
