import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import FileDrop from '../../content/Components/FileDrop/FileDrop';
import { fileDrop } from '../../constants/code/Components/fileDropCode';

const BYTES_PER_MB = 1_000_000;

const DEFAULT_PROPS = {
  accept: '',
  multiple: true,
  maxSize: 5_000_000
};

const FileDropDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'accept', type: 'string', default: "''", description: 'Comma-separated input accept filter.' },
      { name: 'multiple', type: 'boolean', default: 'true', description: 'Allow more than one file.' },
      { name: 'maxSize', type: 'number', default: '5000000', description: 'Max accepted size per file, in bytes.' },
      {
        name: 'onFiles',
        type: '(files: File[]) => void',
        default: 'undefined',
        description: 'Fires with the current file set on every change.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={fileDrop}
      componentName="FileDrop"
      preview={({ props, key }) => <FileDrop key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSwitch title="Multiple" isChecked={props.multiple} onChange={v => set('multiple', v)} />
            <PreviewSlider
              title="Max size"
              min={1}
              max={20}
              step={1}
              value={Math.round(props.maxSize / BYTES_PER_MB)}
              valueUnit="mb"
              onChange={v => set('maxSize', v * BYTES_PER_MB)}
            />
          </>
        );
      }}
    />
  );
};

export default FileDropDemo;
