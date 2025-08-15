'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {DishType} from '@/types';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';

type Props = {
  dish: DishType;
};

export const FavoriteItem: React.FC<Props> = ({dish}) => {
  const router = useRouter();

  return (
    <li
      style={{
        ...constants.flex.rowAlignCenter,
        gap: 16,
        borderBottom: '1px solid #E2E2E2',
        paddingBottom: 10,
      }}
      onClick={() => {
        router.push(`${constants.routes.dish}/${dish.id}`);
      }}
    >
      <img
        src={dish.image}
        alt={dish.name}
        style={{width: 73, height: 73, borderRadius: 5}}
      />
      <div style={{...constants.flex.flexColumn, flex: 1}}>
        <h4 style={{...constants.typography.h4, marginBottom: 4}}>
          {dish.name}
        </h4>
        <p
          className="number-of-lines-1"
          style={{marginBottom: 8, fontSize: 14}}
        >
          {dish.ingredients?.join(', ') || 'No ingredients'}
        </p>
        <div style={{...constants.flex.rowAlignCenter, gap: 4}}>
          <svg.StarFrSvg />
          <span style={{fontSize: 14, color: constants.colors.titlesColor}}>
            {typeof dish.rating === 'number' ? dish.rating.toFixed(1) : '—'}
          </span>
        </div>
      </div>
      <svg.RightArrowSvg />
    </li>
  );
};
