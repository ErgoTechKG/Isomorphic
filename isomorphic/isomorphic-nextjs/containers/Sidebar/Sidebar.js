import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import clone from 'clone';
import { Layout } from 'antd';
import Scrollbars from '@iso/components/utility/customScrollBar';
import Menu from '@iso/components/uielements/menu';
import siteConfig from '@iso/config/site.config';
import IntlMessages from '@iso/components/utility/intlMessages';

import appActions from '@iso/redux/app/actions';
import Logo from '@iso/components/utility/Logo.next';
import SidebarWrapper from './Sidebar.styles';
import SIDEBAR_MENU_OPTIONS from './sidebar.navigations';

const { Sider } = Layout;
const { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed } =
  appActions;

export default function Sidebar(props) {
  const router = useRouter();
  const url = siteConfig.dashboard;

  const { view, openKeys, collapsed, openDrawer, height, current } =
    useSelector((state) => state.App);
  const { sidebarTheme } = useSelector((state) => state.ThemeSwitcher);
  const dispatch = useDispatch();
  function handleClick(e) {
    dispatch(changeCurrent([e.key]));
    if (view === 'MobileView') {
      setTimeout(() => {
        dispatch(toggleCollapsed());
        // dispatch(toggleOpenDrawer());
      }, 100);
    }
  }
  function onOpenChange(newOpenKeys) {
    const latestOpenKey = newOpenKeys.find(
      (key) => !(openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = openKeys.find(
      (key) => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = getAncestorKeys(latestCloseKey);
    }
    dispatch(changeOpenKeys(nextOpenKeys));
  }
  const getAncestorKeys = (key) => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  const isCollapsed = collapsed && !openDrawer;
  const mode = isCollapsed === true ? 'vertical' : 'inline';
  // const scrollheight = height;
  const styling = {
    backgroundColor: sidebarTheme.backgroundColor,
  };
  const submenuColor = {
    color: sidebarTheme.textColor,
  };
  const onMouseEnter = () => {
    if (collapsed && openDrawer === false) {
      dispatch(toggleOpenDrawer());
    }
    return;
  };
  const onMouseLeave = () => {
    if (collapsed && openDrawer === true) {
      dispatch(toggleOpenDrawer());
    }
    return;
  };

  const handleItemClick = (event, linkTo) => {
    event.preventDefault();
    router.push(linkTo);
  };

  const sidebarItems = SIDEBAR_MENU_OPTIONS.map(
    ({ key, label, leftIcon, children }) => {
      if (children) {
        return {
          key,
          label: (
            <span className="isoMenuHolder" style={submenuColor}>
              {leftIcon}
              <span className="nav-text">
                <IntlMessages id={label} />
              </span>
            </span>
          ),
          children: children.map((child) => {
            const linkTo = child.withoutDashboard
              ? `/${child.key}`
              : `${url}/${child.key}`;
            return {
              key: child.key,
              label: (
                <a
                  href={linkTo}
                  onClick={(even) => handleItemClick(event, linkTo)}
                  className="isoMenuHolder"
                  style={submenuColor}
                >
                  <IntlMessages id={child.label} />
                </a>
              ),
            };
          }),
        };
      }
      return {
        key,
        label: (
          <Link href={`${url}/${key}`}>
            <a className="isoMenuHolder" style={submenuColor}>
              {leftIcon}
              <span className="nav-text">
                <IntlMessages id={label} />
              </span>
            </a>
          </Link>
        ),
      };
    }
  );

  return (
    <SidebarWrapper>
      <Sider
        trigger={null}
        collapsible={true}
        collapsed={isCollapsed}
        width={240}
        className="isomorphicSidebar"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={styling}
      >
        <Logo collapsed={isCollapsed} />
        <Scrollbars style={{ height: height - 70 }}>
          <Menu
            items={sidebarItems}
            onClick={handleClick}
            theme="dark"
            mode={mode}
            openKeys={isCollapsed ? [] : openKeys}
            selectedKeys={current}
            onOpenChange={onOpenChange}
            className="isoDashboardMenu"
            // inlineCollapsed={isCollapsed}
          />
        </Scrollbars>
      </Sider>
    </SidebarWrapper>
  );
}
