import React from 'react';
import { DropdownButtons, DropdownMenu } from '../uielements/dropdown';

export default ({ value, onChange, orderStatusOptions }) => (
  <DropdownButtons
    overlay={
      <DropdownMenu
        items={orderStatusOptions}
        onClick={(val) => onChange(orderStatusOptions[val.key])}
      />
    }
  >
    {value}
  </DropdownButtons>
);
