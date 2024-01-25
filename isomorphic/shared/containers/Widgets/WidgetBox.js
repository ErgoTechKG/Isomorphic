import React from 'react';
import { WidgetBox as WidgetBoxWrapper } from './Widgets.styles';

export default function WidgetBox({ children, style, height, padding }) {
  return (
    <WidgetBoxWrapper
      className="isoWidgetBox"
      height={height}
      padding={padding}
      style={style}
    >
      {children}
    </WidgetBoxWrapper>
  );
}
