import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import Dropdown, {
  DropdownButtons,
  DropdownMenu,
} from '@iso/components/uielements/dropdown';
import message from '@iso/components/uielements/message';
import PageHeader from '@iso/components/utility/pageHeader';
import Box from '@iso/components/utility/box';
import LayoutWrapper from '@iso/components/utility/layoutWrapper';
import ContentHolder from '@iso/components/utility/contentHolder';
import IntlMessages from '@iso/components/utility/intlMessages';
import basicStyle from '@iso/assets/styles/constants';
import { direction } from '@iso/lib/helpers/rtl';

const DropdownButton = DropdownButtons;

export default function IsoDropDown() {
  const handleButtonClick = (e) => {
    message.info('Click on left button.');
  };

  const handleMenuClickToLink = (e) => {
    message.info('Click on menu item.');
  };

  const { rowStyle, colStyle, gutter } = basicStyle;
  const demoStyle = {
    marginBottom: '8px',
    marginRight: '8px',
  };

  const menuHoverItems = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="http://redq.io/">
          1st menu item
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="http://redq.io/">
          2nd menu item
        </a>
      ),
    },
    {
      key: '3',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="http://redq.io/">
          3rd menu item
        </a>
      ),
    },
  ];

  const menuHoverDisabledItems = menuHoverItems.map((item) =>
    item.key === '3'
      ? { ...item, label: '3rd menu item (disabled)', disabled: true }
      : item
  );
  menuHoverDisabledItems.splice(2, 0, {
    key: 'menuHoverDisabled.divider',
    type: 'divider',
  });

  const menuClickedItem = [
    {
      key: '1',
      label: '1st menu item',
    },
    {
      key: '2',
      label: '2nd menu item',
    },
    {
      key: '3',
      label: '3rd menu item',
    },
  ];

  const menuSubmenuItems = [
    {
      key: '1',
      label: '1st menu item',
    },
    {
      key: '2',
      label: '2nd menu item',
    },
    {
      key: 'sub1',
      label: 'sub menu',
      children: [
        {
          key: '3',
          label: '3rd menu item',
        },
        {
          key: '4',
          label: '4th menu item',
        },
      ],
    },
  ];

  return (
    <LayoutWrapper>
      <PageHeader>
        {<IntlMessages id="uiElements.dropdown.dropdown" />}
      </PageHeader>

      <Row style={rowStyle} gutter={gutter} justify="start">
        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box title={<IntlMessages id="uiElements.dropdown.hoverDropdown" />}>
            <ContentHolder>
              <Dropdown overlay={<DropdownMenu items={menuHoverItems} />}>
                <a className="ant-dropdown-link" href="# ">
                  {<IntlMessages id="uiElements.dropdown.hoverMe" />}{' '}
                  <DownOutlined />
                </a>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>

        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box title={<IntlMessages id="uiElements.dropdown.hoverPlacement" />}>
            <ContentHolder>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="bottomLeft"
              >
                <Button style={demoStyle}>bottomLeft</Button>
              </Dropdown>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="bottom"
              >
                <Button style={demoStyle}>bottomCenter</Button>
              </Dropdown>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="bottomRight"
              >
                <Button style={demoStyle}>bottomRight</Button>
              </Dropdown>
              <br />
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="topLeft"
              >
                <Button style={demoStyle}>topLeft</Button>
              </Dropdown>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="top"
              >
                <Button style={demoStyle}>topCenter</Button>
              </Dropdown>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                placement="topRight"
              >
                <Button style={demoStyle}>topRight</Button>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>
      </Row>

      <Row style={rowStyle} gutter={gutter} justify="start">
        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box
            title={<IntlMessages id="uiElements.dropdown.hoverDisableLink" />}
          >
            <ContentHolder>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverDisabledItems} />}
              >
                <a className="ant-dropdown-link" href="# ">
                  Hover me <DownOutlined />
                </a>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>

        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box
            title={<IntlMessages id="uiElements.dropdown.clickedDropdown" />}
          >
            <ContentHolder>
              <Dropdown
                overlay={<DropdownMenu items={menuHoverItems} />}
                trigger={['click']}
              >
                <a className="ant-dropdown-link" href="# ">
                  Click me <DownOutlined />
                </a>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>
      </Row>

      <Row style={rowStyle} gutter={gutter} justify="start">
        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box title={<IntlMessages id="uiElements.dropdown.buttonDropdown" />}>
            <ContentHolder>
              <DropdownButton
                onClick={handleButtonClick}
                overlay={
                  <DropdownMenu
                    onClick={handleMenuClickToLink}
                    items={menuClickedItem}
                  />
                }
                style={{ display: 'inline' }}
              >
                Dropdown
              </DropdownButton>
              <DropdownButton
                onClick={handleButtonClick}
                overlay={
                  <DropdownMenu
                    onClick={handleMenuClickToLink}
                    items={menuClickedItem}
                  />
                }
                disabled
                style={{
                  margin: direction === 'rtl' ? '0 8px 0 0' : '0 0 0 8px',
                  display: 'inline',
                }}
              >
                Dropdown
              </DropdownButton>
              <Dropdown
                overlay={
                  <DropdownMenu
                    onClick={handleMenuClickToLink}
                    items={menuClickedItem}
                  />
                }
                style={{ display: 'inline' }}
              >
                <Button
                  style={{
                    margin: direction === 'rtl' ? '0 8px 0 0' : '0 0 0 8px',
                  }}
                >
                  Button <DownOutlined />
                </Button>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>

        <Col md={12} sm={12} xs={24} style={colStyle}>
          <Box
            title={<IntlMessages id="uiElements.dropdown.clickedDropdown" />}
          >
            <ContentHolder>
              <Dropdown overlay={<DropdownMenu items={menuSubmenuItems} />}>
                <a className="ant-dropdown-link" href="# ">
                  Cascading menu <DownOutlined />
                </a>
              </Dropdown>
            </ContentHolder>
          </Box>
        </Col>
      </Row>
    </LayoutWrapper>
  );
}
