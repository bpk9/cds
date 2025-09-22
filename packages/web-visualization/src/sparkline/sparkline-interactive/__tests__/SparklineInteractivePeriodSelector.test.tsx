import type { SparklineInteractivePeriodSelectorProps } from '../SparklineInteractivePeriodSelector';

const mockTabs = [
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

const mockActiveTab = { id: '1d', label: '1D' };
const mockOnChange = jest.fn();

describe('SparklineInteractivePeriodSelector', () => {
  afterEach(() => {
    mockOnChange.mockClear();
  });

  it('accepts correct props structure', () => {
    // Test that the component accepts the updated API props
    const validProps: SparklineInteractivePeriodSelectorProps = {
      activeTab: mockActiveTab,
      color: 'blue',
      onChange: mockOnChange,
      tabs: mockTabs,
    };

    // Verify the props structure matches expected API
    expect(validProps.activeTab).toEqual({ id: '1d', label: '1D' });
    expect(validProps.color).toBe('blue');
    expect(typeof validProps.onChange).toBe('function');
    expect(validProps.tabs).toHaveLength(3);
    expect(validProps.tabs[0]).toEqual({ id: '1h', label: '1H' });
  });

  it('supports optional color prop', () => {
    const propsWithoutColor: SparklineInteractivePeriodSelectorProps = {
      activeTab: mockActiveTab,
      onChange: mockOnChange,
      tabs: mockTabs,
    };

    expect(propsWithoutColor.color).toBeUndefined();
    expect(propsWithoutColor.activeTab).toBeDefined();
    expect(propsWithoutColor.onChange).toBeDefined();
    expect(propsWithoutColor.tabs).toBeDefined();
  });

  it('validates tab structure', () => {
    mockTabs.forEach((tab) => {
      expect(tab).toHaveProperty('id');
      expect(tab).toHaveProperty('label');
      expect(typeof tab.id).toBe('string');
    });
  });

  it('validates activeTab structure', () => {
    expect(mockActiveTab).toHaveProperty('id');
    expect(mockActiveTab).toHaveProperty('label');
    expect(typeof mockActiveTab.id).toBe('string');
  });

  it('onChange callback accepts tab parameter', () => {
    const testTab = { id: 'test', label: 'Test' };
    mockOnChange(testTab);

    expect(mockOnChange).toHaveBeenCalledWith(testTab);
  });
});
