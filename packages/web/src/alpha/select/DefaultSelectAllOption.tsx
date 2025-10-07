import { memo } from 'react';

import { Divider } from '../../layout/Divider';

import { DefaultSelectOption } from './DefaultSelectOption';
import { type SelectOptionComponent, type SelectOptionProps, type SelectType } from './Select';

function DefaultSelectAllOptionComponent<Type extends SelectType, T extends string = string>({
  accessory,
  blendStyles,
  className,
  compact,
  detail,
  disabled,
  label,
  media,
  onClick,
  selected,
  style,
  type,
}: SelectOptionProps<Type, T>) {
  return (
    <>
      <DefaultSelectOption
        key="select-all"
        accessory={accessory}
        blendStyles={blendStyles}
        className={className}
        compact={compact}
        detail={detail}
        disabled={disabled}
        label={label}
        media={media}
        onClick={onClick}
        selected={selected}
        style={style}
        type={type}
        value={'select-all' as T}
      />
      <Divider paddingX={2} />
    </>
  );
}

export const DefaultSelectAllOption = memo(DefaultSelectAllOptionComponent) as <
  Type extends SelectType,
  T extends string = string,
>(
  props: SelectOptionProps<Type, T>,
) => ReturnType<SelectOptionComponent<Type, T>>;
