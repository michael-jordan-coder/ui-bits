import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import NotificationStack from '../../content/Components/NotificationStack/NotificationStack';
import { notificationStack } from '../../constants/code/Components/notificationStackCode';

const SAMPLE_NOTIFICATIONS = [
  { id: 'n1', title: 'New comment', body: 'Maya replied to your thread.' },
  { id: 'n2', title: 'Build passed', body: 'Deploy to production finished.' },
  { id: 'n3', title: 'Weekly summary', body: 'Your activity report is ready.' },
  { id: 'n4', title: 'Invite accepted', body: 'Theo joined your workspace.' },
  { id: 'n5', title: 'Payment received', body: 'Invoice 0042 was settled.' }
];

const DEFAULT_PROPS = {
  accent: '#3ecf8e',
  collapsedByDefault: true,
  count: 3
};

const NotificationStackDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'notifications',
        type: 'Notification[]',
        default: '3 samples',
        description: 'Array of { id, title, body } cards to render.'
      },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Accent color for the icon and toggle.' },
      {
        name: 'collapsedByDefault',
        type: 'boolean',
        default: 'true',
        description: 'Start as a tucked stack rather than expanded.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      demoOnlyProps={['count']}
      dependencies={['motion', 'lucide-react']}
      codeObject={notificationStack}
      componentName="NotificationStack"
      preview={({ props, key }) => (
        <NotificationStack
          key={key}
          accent={props.accent}
          collapsedByDefault={props.collapsedByDefault}
          notifications={SAMPLE_NOTIFICATIONS.slice(0, props.count)}
        />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSwitch
              title="Collapsed by default"
              isChecked={props.collapsedByDefault}
              onChange={v => set('collapsedByDefault', v)}
            />
            <PreviewSlider
              title="Notifications"
              min={1}
              max={SAMPLE_NOTIFICATIONS.length}
              step={1}
              value={props.count}
              onChange={v => set('count', v)}
            />
          </>
        );
      }}
    />
  );
};

export default NotificationStackDemo;
