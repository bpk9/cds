import React from 'react';

import { Example, ExampleScreen } from '../../examples/ExampleScreen';
import { useTheme } from '../../hooks/useTheme';

import { ScrollableTray } from './Trays';

export const TrayHandleBarInside = () => {
  const theme = useTheme();
  return (
    <ExampleScreen>
      <Example title="Tray with Handle Bar Inside">
        <ScrollableTray
          handleBarVariant="inside"
          title="Tray with Handle Bar Inside"
          verticalDrawerPercentageOfView={0.9}
        />
      </Example>
    </ExampleScreen>
  );
};

export default TrayHandleBarInside;
