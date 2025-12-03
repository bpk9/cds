import { forwardRef, memo, useCallback } from 'react';

import { NativeInput } from '../../controls/NativeInput';
import { NAVIGATION_KEYS } from '../../overlays/FocusTrap';
import { DefaultSelectControl } from '../select';
import type { SelectType } from '../select/Select';

import type { ComboboxControlComponent, ComboboxControlProps } from './Combobox';

const DefaultComboboxControlComponent = memo(
  forwardRef(
    <Type extends SelectType, SelectOptionValue extends string = string>(
      {
        value,
        setOpen,
        searchText,
        onSearch,
        hideSearchInput,
        ...props
      }: ComboboxControlProps<Type, SelectOptionValue>,
      ref: React.Ref<HTMLDivElement>,
    ) => {
      const hasValue = value !== null && !(Array.isArray(value) && value.length === 0);
      const handleSearchChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
          onSearch(event.target.value);
        },
        [onSearch],
      );

      return (
        <DefaultSelectControl
          ref={ref}
          setOpen={setOpen}
          value={value}
          {...props}
          contentNode={
            hideSearchInput ? null : (
              <NativeInput
                onChange={handleSearchChange}
                onKeyDown={(event) => {
                  if (!NAVIGATION_KEYS.includes(event.key)) {
                    event.stopPropagation();
                  }
                  if (
                    event.key === 'Enter' ||
                    (!NAVIGATION_KEYS.includes(event.key) && !event.shiftKey)
                  ) {
                    setOpen(true);
                  }
                }}
                style={{
                  padding: 0,
                  paddingTop: value?.length && value?.length > 0 ? 8 : 0,
                  width: '100%',
                }}
                tabIndex={0}
                value={searchText}
              />
            )
          }
          placeholder={null}
          styles={{
            // TODO add
            ...props.styles,
            controlEndNode: {
              alignItems: hasValue && !hideSearchInput ? 'flex-end' : 'center',
            },
          }}
          tabIndex={-1}
        />
      );
    },
  ),
);

export const DefaultComboboxControl = DefaultComboboxControlComponent as ComboboxControlComponent;
