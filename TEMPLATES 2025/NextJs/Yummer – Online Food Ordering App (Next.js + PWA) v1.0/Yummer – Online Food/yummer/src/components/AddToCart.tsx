'use client';

import React from 'react';

import {DishType} from '@/types';
import {constants} from '@/constants';
import {cartActions} from '@/lib/cartSlice';
import {useAppDispatch} from '@/lib/store';

type Props = {
  dish: DishType;
};

export const AddToCart: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();

  return (
    <button
      style={{
        backgroundColor: '#E8F9F1',
        height: 32,
        borderRadius: 5,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(cartActions.addToCart(dish));
      }}
    >
      <span
        style={{
          fontSize: 12,
          color: constants.colors.seaGreenColor,
          fontWeight: 500,
        }}
      >
        Add to Cart
      </span>
    </button>
  );
};
