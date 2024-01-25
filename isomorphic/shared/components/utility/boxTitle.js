import React from 'react';
import { BoxTitle as BoxTitleWrapper, BoxSubTitle } from './boxTitle.style';

export default function BoxTitle(props) {
  return (
    <div>
      {props.title ? (
        <BoxTitleWrapper className="isoBoxTitle">
          {' '}
          {props.title}{' '}
        </BoxTitleWrapper>
      ) : (
        ''
      )}
      {props.subtitle ? (
        <BoxSubTitle className="isoBoxSubTitle"> {props.subtitle} </BoxSubTitle>
      ) : (
        ''
      )}
    </div>
  );
}
