import { DefaultThemeProvider } from '@coinbase/cds-mobile/utils/testHelpers';
import { fireEvent, render, screen } from '@testing-library/react-native';

import { SparklineInteractivePeriodSelector } from '../SparklineInteractivePeriodSelector';

const tabs = [
  {
    id: '1h',
    label: '1H',
  },
  {
    id: '1d',
    label: '1D',
  },
  {
    id: '1w',
    label: '1W',
  },
];

const onChangeSpy = jest.fn();

const SparklineInteractivePeriodSelectorExample = () => {
  return (
    <DefaultThemeProvider>
      <SparklineInteractivePeriodSelector
        activeTab={tabs[1]}
        color="blue"
        onChange={onChangeSpy}
        tabs={tabs}
      />
    </DefaultThemeProvider>
  );
};

describe('SparklineInteractivePeriodSelector', () => {
  afterEach(() => {
    onChangeSpy.mockClear();
  });

  it('renders period buttons', () => {
    render(<SparklineInteractivePeriodSelectorExample />);

    expect(screen.getAllByRole('button')).toHaveLength(tabs.length);
    expect(screen.getByText('1H')).toBeTruthy();
    expect(screen.getByText('1D')).toBeTruthy();
    expect(screen.getByText('1W')).toBeTruthy();
  });

  it('calls onChange when period button is pressed', () => {
    render(<SparklineInteractivePeriodSelectorExample />);

    fireEvent.press(screen.getAllByRole('button')[0]);

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
  });
});
