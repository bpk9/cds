import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import Fuse from 'fuse.js';

import { NativeInput } from '../../controls/NativeInput';
import { NAVIGATION_KEYS } from '../../overlays/FocusTrap';
import type { SelectOptionList } from '../select';
import { DefaultSelectControl } from '../select/DefaultSelectControl';
import type {
  SelectBaseProps,
  SelectControlComponent,
  SelectControlProps,
  SelectOption,
  SelectProps,
  SelectRef,
  SelectType,
} from '../select/Select';
import { Select } from '../select/Select';

import { DefaultComboboxControl } from './DefaultComboboxControl';

export type ComboboxControlProps<
  Type extends SelectType = 'single',
  SelectOptionValue extends string = string,
> = SelectControlProps<Type, SelectOptionValue> & {
  /** Search text value */
  searchText: string;
  /** Search text change handler */
  onSearch: (searchText: string) => void;
  /** Hide the search input */
  hideSearchInput?: boolean;
};

export type ComboboxControlComponent<
  Type extends SelectType = 'single',
  SelectOptionValue extends string = string,
> = React.FC<ComboboxControlProps<Type, SelectOptionValue> & { ref?: React.Ref<HTMLElement> }>;

export type ComboboxBaseProps<
  Type extends SelectType = 'single',
  SelectOptionValue extends string = string,
> = Omit<SelectBaseProps<Type, SelectOptionValue>, 'SelectControlComponent'> & {
  /** Controlled search text value */
  searchText?: string;
  /** Search text change handler */
  onSearch?: (searchText: string) => void;
  /** Custom filter function for searching options */
  filterFunction?: (
    options: SelectOptionList<Type, SelectOptionValue>,
    searchText: string,
  ) => SelectOption<SelectOptionValue>[];
  /** Default search text value for uncontrolled mode */
  defaultSearchText?: string;
  /** Hide the search input */
  hideSearchInput?: boolean;
  /** Custom component to render as the select control */
  SelectControlComponent?: ComboboxControlComponent<Type, SelectOptionValue>;
};

export type ComboboxProps<
  Type extends SelectType = 'single',
  SelectOptionValue extends string = string,
> = ComboboxBaseProps<Type, SelectOptionValue> &
  Pick<SelectProps<Type, SelectOptionValue>, 'styles' | 'classNames'>;

export type ComboboxRef = SelectRef;

type ComboboxComponent = <
  Type extends SelectType = 'single',
  SelectOptionValue extends string = string,
>(
  props: ComboboxProps<Type, SelectOptionValue> & { ref?: React.Ref<ComboboxRef> },
) => React.ReactElement;

const ComboboxBase = memo(
  forwardRef(
    <Type extends SelectType = 'single', SelectOptionValue extends string = string>(
      {
        type = 'single' as Type,
        value,
        onChange,
        options,
        open: openProp,
        setOpen: setOpenProp,
        placeholder,
        accessibilityLabel = 'Combobox control',
        defaultOpen,
        searchText: searchTextProp,
        onSearch: onSearchProp,
        defaultSearchText = '',
        filterFunction,
        SelectControlComponent = DefaultComboboxControl as ComboboxControlComponent<
          Type,
          SelectOptionValue
        >,
        ...props
      }: ComboboxProps<Type, SelectOptionValue>,
      ref: React.Ref<ComboboxRef>,
    ) => {
      const [searchTextInternal, setSearchTextInternal] = useState(defaultSearchText);
      const searchText = searchTextProp ?? searchTextInternal;
      const setSearchText = onSearchProp ?? setSearchTextInternal;
      if ((typeof searchTextProp === 'undefined') !== (typeof onSearchProp === 'undefined')) {
        throw Error(
          'Combobox component must be fully controlled or uncontrolled: "searchText" and "onSearch" props must be provided together or not at all',
        );
      }

      const [openInternal, setOpenInternal] = useState(defaultOpen ?? false);
      const open = openProp ?? openInternal;
      const setOpen = setOpenProp ?? setOpenInternal;
      if ((typeof openProp === 'undefined') !== (typeof setOpenProp === 'undefined'))
        throw Error(
          'Combobox component must be fully controlled or uncontrolled: "open" and "setOpen" props must be provided together or not at all',
        );

      const fuse = useMemo(
        () =>
          new Fuse(options, {
            keys: ['label', 'description'],
            threshold: 0.3,
          }),
        [options],
      );

      const filteredOptions = useMemo(() => {
        if (searchText.length === 0) return options;
        if (filterFunction) return filterFunction(options, searchText);
        return fuse.search(searchText).map((result) => result.item);
      }, [filterFunction, fuse, options, searchText]);

      const handleChange = useCallback(
        (
          value: Type extends 'multi'
            ? SelectOptionValue | SelectOptionValue[] | null
            : SelectOptionValue | null,
        ) => {
          onChange?.(value);
        },
        [onChange],
      );

      const controlRef = useRef<ComboboxRef>(null);
      useImperativeHandle(ref, () =>
        Object.assign(controlRef.current as ComboboxRef, {
          open,
          setOpen,
        }),
      );

      // Store in refs to avoid recreating ComboboxControl on every search text change
      const searchTextRef = useRef(searchText);
      searchTextRef.current = searchText;
      const setSearchTextRef = useRef(setSearchText);
      setSearchTextRef.current = setSearchText;
      const valueRef = useRef(value);
      valueRef.current = value;
      const optionsRef = useRef(options);
      optionsRef.current = options;

      const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTextRef.current(event.target.value);
      }, []);

      return (
        <Select
          ref={controlRef}
          SelectControlComponent={(props) => {
            return (
              <SelectControlComponent
                {...props}
                onSearch={setSearchText}
                searchText={searchText}
                type={type}
                value={value}
              />
            );
          }}
          // SelectControlComponent={CustomControl as SelectControlComponent<Type, SelectOptionValue>}
          accessibilityLabel={accessibilityLabel}
          defaultOpen={defaultOpen}
          onChange={handleChange}
          open={open}
          options={filteredOptions}
          placeholder={placeholder}
          setOpen={setOpen}
          type={type}
          value={value}
          {...props}
        />
      );
    },
  ),
);

const Foo = <Type extends SelectType, SelectOptionValue extends string>(
  props: SelectControlProps<Type, SelectOptionValue> & { foo: string },
) => {
  return (
    <div>
      <input type="text" value={props.value ?? ''} />
    </div>
  );
};

const CustomControl = Foo as SelectControlComponent<SelectType, string>;

export const Combobox = ComboboxBase as ComboboxComponent;
