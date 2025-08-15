'use client';

import React from 'react';
import Link from 'next/link';

import {DishType} from '@/types';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';

type Props = {
  dish: DishType;
};

export const OrderItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const inCart = cart.find((item) => item.id === dish?.id);
  const quantity = inCart ? inCart.quantity : 0;

  function getFirstTwoWords(text: string) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 2) return text;
    return words.slice(0, 2).join(' ') + '…';
  }

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
        paddingRight: 4,
        width: '100%',
      }}
    >
      <img
        src={dish.image}
        alt={dish.name}
        style={{width: 100, height: 'auto', borderRadius: 10}}
      />

      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
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
          {getFirstTwoWords(dish.ingredients?.join(', ') || 'No ingredients')}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 0,
          flexDirection: 'column',
          marginLeft: 20,
          alignItems: 'center',
        }}
      >
        <button
          style={{padding: 10}}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dispatch(cartActions.removeFromCart(dish));
          }}
        >
          <svg.MinusSvg />
        </button>
        <span style={{fontSize: 10}}>{quantity}</span>
        <button
          style={{padding: 10}}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            dispatch(cartActions.addToCart(dish));
          }}
        >
          <svg.PlusSvg />
        </button>
      </div>
    </Link>
  );
};
