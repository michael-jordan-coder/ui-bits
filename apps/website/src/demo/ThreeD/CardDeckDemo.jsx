import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import CardDeck from '../../content/ThreeD/CardDeck/CardDeck';
import { cardDeck } from '../../constants/code/ThreeD/cardDeckCode';

const DEFAULT_PROPS = {};

const CardDeckDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'className', type: 'string', default: '', description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={cardDeck}
      componentName="CardDeck"
      preview={({ props, key }) => <CardDeck key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default CardDeckDemo;
