import React from 'react';
import { useSelector } from 'react-redux';
import { InputSearch } from '@iso/components/uielements/input';
import TopbarSearchModal from './TopbarSearchModal.styles';
import { TopbarSearchIcon } from '@iso/config/icon.config';

function Searchbar(props) {
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

export default function TopbarSearch() {
  const [visible, setVisibility] = React.useState(false);
  const customizedTheme = useSelector(
    (state) => state.ThemeSwitcher.topbarTheme
  );

  const handleCancel = () => {
    setVisibility(false);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setVisibility(false);
    }, 200);
  };
  const showModal = () => {
    setVisibility(true);
  };
  return (
    <div onClick={showModal}>
      <TopbarSearchIcon size={24} color={customizedTheme.textColor} />
      <TopbarSearchModal
        open={visible}
        onOk={handleCancel}
        onCancel={handleCancel}
        wrapClassName="isoSearchModal"
        width="60%"
        footer={null}
      >
        <div className="isoSearchContainer">
          {visible ? <Searchbar onBlur={handleBlur} /> : ''}
        </div>
      </TopbarSearchModal>
    </div>
  );
}
