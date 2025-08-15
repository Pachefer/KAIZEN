'use client';

import React from 'react';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import type {PromocodeType} from '@/types';

type Props = {promocode: PromocodeType};

export const PromocodeItem: React.FC<Props> = ({promocode}) => {
  const copyPromocode = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        alert('Promocode copied to clipboard!');
      })
      .catch(() => {
        alert('Failed to copy promocode.');
      });
  };

  const renderColor = () => {
    if (promocode.discount >= 50) {
      return constants.colors.mainColor2;
    } else if (promocode.discount >= 30) {
      return constants.colors.mainColor;
    } else {
      return '#00824B';
    }
  };

  const renderContent = () => {
    return (
      <div
        style={{
          borderBottom: '1px solid #E2E2E2',
          ...constants.flex.rowAlignCenter,
          paddingBottom: 10,
          gap: 16,
          cursor: 'pointer',
        }}
        onClick={() => copyPromocode(promocode.code)}
      >
        <img
          src={promocode.logo}
          alt={promocode.name}
          className="promocode-logo"
          style={{width: 73, height: 73, borderRadius: 5}}
        />
        <div style={{...constants.flex.flexColumn, flex: 1}}>
          <h5
            style={{
              marginBottom: 2,
              ...constants.typography.h5,
            }}
            className="number-of-lines-1"
          >
            {promocode.name}
          </h5>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: renderColor(),
              marginBottom: 10,
            }}
            className="number-of-lines-1"
          >
            {promocode.discount}% Off
          </span>
          <span
            className="number-of-lines-1"
            style={{fontSize: 14, display: 'block'}}
          >
            Valid until {promocode.expiresAt}
          </span>
        </div>
        <svg.CopySvg />
      </div>
    );
  };

  return renderContent();
};
