import { useMultiSelect } from '@coinbase/cds-common/select/useMultiSelect';

import { VStack } from '../../../layout/VStack';
import type { SelectOption } from '../../select/Select';
import { Combobox } from '../Combobox';

export default {
  title: 'Components/Alpha/Combobox',
  component: Combobox,
};

const exampleOptions: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
  { value: 'honeydew', label: 'Honeydew' },
  { value: 'kiwi', label: 'Kiwi' },
  { value: 'lemon', label: 'Lemon' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'papaya', label: 'Papaya' },
  { value: 'raspberry', label: 'Raspberry' },
  { value: 'strawberry', label: 'Strawberry' },
];

export const Default = () => {
  const { value, onChange } = useMultiSelect({ initialValue: ['apple', 'banana'] });

  return (
    <VStack gap={4} width={400}>
      <Combobox
        label="Fruits"
        onChange={onChange}
        options={exampleOptions}
        placeholder="Search fruits..."
        value={value}
      />
    </VStack>
  );
};
