'use client';

import React from 'react';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import type {PromocodeType} from '@/types';

type Props = {promocode: PromocodeType};

export const PromocodeItem: React.FC<Props> = ({promocode}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(promocode.code);
    alert('Promocode copied to clipboard!');
  };

  const renderContent = () => {
    return (
      <button
        style={{
          border: '1px solid #F1F1F1',
          padding: 15,
          borderRadius: 10,
          ...constants.flex.row,
          gap: 15,
          cursor: 'pointer',
        }}
        onClick={handleCopy}
      >
        <img
          src={promocode.logo}
          alt={promocode.name}
          className="promocode-logo"
          style={{width: 55, height: 55}}
        />
        <div style={{...constants.flex.column, flex: 1}}>
          <h2
            style={{
              fontSize: 16,
              color: constants.colors.mainDarkColor,
              fontWeight: 'bold',
              marginBottom: 3,
            }}
            className="number-of-lines-1"
          >
            {promocode.name}
          </h2>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: constants.colors.redColor,
              marginBottom: 3,
            }}
            className="number-of-lines-1"
          >
            {promocode.discount}% Off
          </span>
          <span className="number-of-lines-1" style={{fontSize: 14}}>
            Valid until {promocode.expiresAt}
          </span>
        </div>
        <svg.CopySvg />
      </button>
    );
  };

  return renderContent();
};
