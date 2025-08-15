'use client';

import React from 'react';
import Link from 'next/link';

import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

type Props = {
  dish: DishType;
};

export const RecommendedItem: React.FC<Props> = ({dish}) => {
  const getWords = (text: string) => {
    const qty = 3;
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= qty) return text;
    return words.slice(0, qty).join(' ') + '…';
  };

  return (
    <Link
      href={`${constants.routes.dish}/${dish.id}`}
      style={{
        gap: 4,
        ...constants.flex.rowCenter,
        ...constants.styles.boxShadow,
        borderRadius: 10,
        padding: 6,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 20,
        width: '100%',
      }}
    >
      <img
        src={dish.image}
        alt={dish.name}
        style={{width: 100, height: 'auto', borderRadius: 10}}
      />
      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: 14,
              color: constants.colors.mainDarkColor,
              fontWeight: 500,
              marginBottom: 6,
              textTransform: 'capitalize',
            }}
          >
            {dish.name}
          </h2>
          <span style={{fontSize: 12, color: constants.colors.textColor}}>
            {dish.weight} {dish.type === 'drink' ? 'ml' : 'g'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 2,
          }}
        >
          <components.Rating rating={3} />
          <span style={{fontSize: 12, color: constants.colors.textColor}}>
            ({dish.rating})
          </span>
        </div>
        <p
          style={{fontSize: 12, color: '#666', marginTop: 4}}
          className="number-of-lines-1"
        >
          {getWords(dish.ingredients?.join(', ') || 'No ingredients')}
        </p>
      </div>
    </Link>
  );
};
