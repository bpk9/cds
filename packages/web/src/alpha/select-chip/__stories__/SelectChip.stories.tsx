import { useCallback, useEffect, useState } from 'react';
import { assets } from '@coinbase/cds-common/internal/data/assets';
import { useMultiSelect } from '@coinbase/cds-common/select/useMultiSelect';

import { Button } from '../../../buttons/Button';
import { Box } from '../../../layout/Box';
import { HStack } from '../../../layout/HStack';
import { VStack } from '../../../layout/VStack';
import { RemoteImage } from '../../../media/RemoteImage';
import { RemoteImageGroup } from '../../../media/RemoteImageGroup';
import { Text } from '../../../typography/Text';
import type { SelectOption, SelectOptionGroup, SelectType } from '../../select/Select';
import { SelectChip } from '../SelectChip';

export default {
  title: 'Components/Alpha/SelectChip',
  component: SelectChip,
};

export const DefaultSingle = () => {
  const exampleOptions = [
    { value: null, label: 'Clear selection' },
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
  ];
  const [value, setValue] = useState<string | null>(null);

  return (
    <SelectChip
      accessibilityLabel="Select a value"
      onChange={setValue}
      options={exampleOptions}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const DefaultMulti = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '5', label: 'Option 5' },
  ];
  const { value, onChange } = useMultiSelect({
    initialValue: [],
  });

  return (
    <SelectChip
      controlAccessibilityLabel="Select multiple values"
      onChange={onChange}
      options={exampleOptions}
      placeholder="Choose options"
      type="multi"
      value={value}
    />
  );
};

export const Compact = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
  ];
  const [value, setValue] = useState<string | null>('1');

  return (
    <SelectChip
      compact
      onChange={setValue}
      options={exampleOptions}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const WithStartEndNodes = () => {
  const exampleOptions = [
    { value: 'btc', label: assets.btc.name },
    { value: 'eth', label: assets.eth.name },
    { value: 'dai', label: assets.dai.name },
  ];
  const [value, setValue] = useState<string | null>('eth');

  // Map each option value to a different asset
  const getStartNode = (selectedValue: string | null) => {
    if (!selectedValue) return null;

    const assetMap: Record<string, string> = {
      btc: assets.btc.imageUrl,
      eth: assets.eth.imageUrl,
      dai: assets.dai.imageUrl,
    };

    const imageUrl = assetMap[selectedValue];
    if (!imageUrl) return null;

    return <RemoteImage height={24} shape="circle" source={imageUrl} width={24} />;
  };

  return (
    <SelectChip
      onChange={setValue}
      options={exampleOptions}
      placeholder="Choose an asset"
      startNode={getStartNode(value)}
      value={value}
    />
  );
};

// Map asset symbols to their image URLs
const assetImageMap: Record<string, string> = {
  btc: assets.btc.imageUrl,
  eth: assets.eth.imageUrl,
  dai: assets.dai.imageUrl,
  ltc: assets.ltc.imageUrl,
  xrp: assets.xrp.imageUrl,
};

// TODO: Add multi-select with assets story when RemoteImageGroup is fixed
// export const MultiSelectWithAssets = () => {
//   const exampleOptions = [
//     { value: 'btc', label: assets.btc.name },
//     { value: 'eth', label: assets.eth.name },
//     { value: 'dai', label: assets.dai.name },
//     { value: 'ltc', label: assets.ltc.name },
//     { value: 'xrp', label: assets.xrp.name },
//   ];
//   const { value, onChange } = useMultiSelect({
//     initialValue: ['eth', 'btc'],
//   });

//   // Get startNode based on selected assets
//   const startNode = useMemo(() => {
//     if (value.length === 0) return null;

//     // Multiple assets selected - use RemoteImageGroup
//     return (
//       <RemoteImageGroup shape="circle" size={24}>
//         {value.map((assetValue) => {
//           const imageUrl = assetImageMap[assetValue];
//           if (!imageUrl) return null;
//           return <RemoteImage key={assetValue} source={imageUrl} />;
//         })}
//       </RemoteImageGroup>
//     );
//   }, [value]);

//   return (
//     <SelectChip
//       controlAccessibilityLabel="Select multiple assets"
//       onChange={onChange}
//       options={exampleOptions}
//       placeholder="Choose assets"
//       startNode={startNode}
//       type="multi"
//       value={value}
//     />
//   );
// };

export const InvertColorScheme = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
  const [value, setValue] = useState<string | null>('1');

  return (
    <VStack background="bgAlternate" borderRadius={200} padding={2}>
      <SelectChip
        invertColorScheme
        onChange={setValue}
        options={exampleOptions}
        placeholder="Choose an option"
        value={value}
      />
    </VStack>
  );
};

export const EmptyOptions = () => {
  const [value, setValue] = useState<string | null>(null);
  return (
    <SelectChip onChange={setValue} options={[]} placeholder="No options available" value={value} />
  );
};

export const WithGroups = () => {
  const exampleOptions = [
    {
      label: 'Group A',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ],
    },
    {
      label: 'Group B',
      disabled: true,
      options: [
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
      ],
    },
    {
      label: 'Group C',
      options: [{ value: '6', label: 'Option 6' }],
    },
  ] as (SelectOption<string> | SelectOptionGroup<SelectType, string>)[];
  const [value, setValue] = useState<string | null>(null);

  return (
    <SelectChip
      accessibilityLabel="Select a value"
      onChange={setValue}
      options={exampleOptions as any}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const MultiWithGroups = () => {
  const exampleOptions: (SelectOption<string> | SelectOptionGroup<SelectType, string>)[] = [
    {
      label: 'Group A',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ],
    },
    {
      label: 'Group B',
      options: [
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
      ],
    },
    {
      label: 'Group C',
      options: [{ value: '6', label: 'Option 6' }],
    },
  ];
  const { value, onChange } = useMultiSelect({
    initialValue: [],
  });

  return (
    <SelectChip
      controlAccessibilityLabel="Select multiple values"
      onChange={onChange}
      options={exampleOptions as any}
      placeholder="Choose options"
      type="multi"
      value={value}
    />
  );
};

export const WithDisabledGroup = () => {
  const exampleOptions: (SelectOption<string> | SelectOptionGroup<SelectType, string>)[] = [
    {
      label: 'Available Options',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ],
    },
    {
      label: 'Unavailable Options (Group Disabled)',
      disabled: true,
      options: [
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
        { value: '6', label: 'Option 6' },
      ],
    },
    {
      label: 'More Available Options',
      options: [
        { value: '7', label: 'Option 7' },
        { value: '8', label: 'Option 8' },
      ],
    },
  ];
  const [value, setValue] = useState<string | null>(null);

  return (
    <SelectChip
      accessibilityLabel="Select a value"
      onChange={setValue}
      options={exampleOptions as any}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const MultiWithDisabledGroup = () => {
  const exampleOptions: (SelectOption<string> | SelectOptionGroup<SelectType, string>)[] = [
    {
      label: 'Available Options',
      options: [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' },
        { value: '3', label: 'Option 3' },
      ],
    },
    {
      label: 'Unavailable Options (Group Disabled)',
      disabled: true,
      options: [
        { value: '4', label: 'Option 4' },
        { value: '5', label: 'Option 5' },
        { value: '6', label: 'Option 6' },
      ],
    },
    {
      label: 'More Available Options',
      options: [
        { value: '7', label: 'Option 7' },
        { value: '8', label: 'Option 8' },
      ],
    },
  ];
  const { value, onChange } = useMultiSelect({
    initialValue: [],
  });

  return (
    <SelectChip
      controlAccessibilityLabel="Select multiple values"
      onChange={onChange}
      options={exampleOptions as any}
      placeholder="Choose options"
      type="multi"
      value={value}
    />
  );
};

export const FullyDisabled = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
  ];
  const [value, setValue] = useState<string | null>('1');

  return (
    <VStack gap={2}>
      <SelectChip
        disabled
        accessibilityLabel="Select a value"
        onChange={setValue}
        options={exampleOptions}
        placeholder="Choose an option"
        value={null}
      />
      <SelectChip
        disabled
        accessibilityLabel="Select a value"
        onChange={setValue}
        options={exampleOptions}
        placeholder="Choose an option"
        value={value}
      />
    </VStack>
  );
};

export const WithDisabledOptions = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2', disabled: true },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4', disabled: true },
  ];
  const [value, setValue] = useState<string | null>(null);

  return (
    <SelectChip
      accessibilityLabel="Select a value"
      onChange={setValue}
      options={exampleOptions}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const WithDescriptions = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1', description: 'First option description' },
    { value: '2', label: 'Option 2', description: 'Second option description' },
    { value: '3', label: 'Option 3', description: 'Third option description' },
    { value: '4', label: 'Option 4', description: 'Fourth option description' },
  ];
  const [value, setValue] = useState<string | null>(null);

  return (
    <SelectChip
      accessibilityLabel="Select a value"
      onChange={setValue}
      options={exampleOptions}
      placeholder="Choose an option"
      value={value}
    />
  );
};

export const LayoutShift = () => {
  const exampleOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '5', label: 'Option 5' },
  ];
  const [value, setValue] = useState<string | null>(null);
  const [showContentAbove, setShowContentAbove] = useState(false);
  const [showContentBelow, setShowContentBelow] = useState(false);
  const [pendingAbove, setPendingAbove] = useState(false);
  const [pendingBelow, setPendingBelow] = useState(false);

  const handleToggleAbove = useCallback(() => {
    if (showContentAbove) {
      setShowContentAbove(false);
      setPendingAbove(false);
    } else {
      setPendingAbove(true);
      setTimeout(() => {
        setShowContentAbove(true);
        setPendingAbove(false);
      }, 1500);
    }
  }, [showContentAbove]);

  const handleToggleBelow = useCallback(() => {
    if (showContentBelow) {
      setShowContentBelow(false);
      setPendingBelow(false);
    } else {
      setPendingBelow(true);
      setTimeout(() => {
        setShowContentBelow(true);
        setPendingBelow(false);
      }, 1500);
    }
  }, [showContentBelow]);

  useEffect(() => {
    return () => {
      // Cleanup timeouts on unmount
      if (pendingAbove || pendingBelow) {
        setPendingAbove(false);
        setPendingBelow(false);
      }
    };
  }, [pendingAbove, pendingBelow]);

  return (
    <VStack gap={4}>
      <VStack gap={2}>
        <Text font="body">Toggle content to simulate layout shifts (1.5s delay):</Text>
        <HStack gap={2}>
          <Button compact disabled={pendingAbove} onClick={handleToggleAbove}>
            {pendingAbove ? 'Showing...' : showContentAbove ? 'Hide' : 'Show'} Content Above
          </Button>
          <Button compact disabled={pendingBelow} onClick={handleToggleBelow}>
            {pendingBelow ? 'Showing...' : showContentBelow ? 'Hide' : 'Show'} Content Below
          </Button>
        </HStack>
        {(pendingAbove || pendingBelow) && <Text>Layout shift will occur in 1.5 seconds...</Text>}
      </VStack>

      {showContentAbove && (
        <Box
          background="bgAlternate"
          borderRadius={200}
          padding={4}
          style={{ minHeight: '200px', transition: 'all 0.3s ease' }}
        >
          <VStack gap={2}>
            <Text font="title1">Content Above SelectChip</Text>
            <Text font="body">This content can be toggled to cause layout shifts.</Text>
            <Text font="body">
              Open the dropdown and toggle this content to test repositioning.
            </Text>
          </VStack>
        </Box>
      )}

      <VStack gap={2}>
        <Text font="body">SelectChip (open dropdown and toggle content above/below):</Text>
        <SelectChip
          accessibilityLabel="Select a value"
          onChange={setValue}
          options={exampleOptions}
          placeholder="Choose an option"
          value={value}
        />
      </VStack>

      {showContentBelow && (
        <Box
          background="bgAlternate"
          borderRadius={200}
          padding={4}
          style={{ minHeight: '200px', transition: 'all 0.3s ease' }}
        >
          <VStack gap={2}>
            <Text font="title1">Content Below SelectChip</Text>
            <Text font="body">This content can be toggled to cause layout shifts.</Text>
            <Text font="body">
              Open the dropdown and toggle this content to test repositioning.
            </Text>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
