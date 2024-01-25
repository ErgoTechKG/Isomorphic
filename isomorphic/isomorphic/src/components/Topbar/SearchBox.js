import React from 'react';
import { InputSearch } from '../uielements/input';
import { TopbarSearchIcon } from '@iso/config/icon.config';
export default function (props) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        document.getElementById('InputTopbarSearch').focus();
      } catch (e) {}
    }, 200);
    return () => {
      clearTimeout(timer);
    };
  });
  return (
    <InputSearch
      id="InputTopbarSearch"
      size="large"
      placeholder="Enter search text"
      onBlur={props.onBlur}
      prefix={
        <TopbarSearchIcon
          style={{
            marginRight: `${props['data-rtl'] === 'rtl' ? '0px' : '10px'}`,
            marginLeft: `${props['data-rtl'] === 'rtl' ? '0px' : '10px'}`,
          }}
          color="rgba(0, 0, 0, 0.5)"
          size={24}
        />
      }
    />
  );
}
