'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {DishType} from '@/types';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {useAppSelector} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';
import {useAppDispatch} from '@/lib/store';

type Props = {
  dish: DishType;
};

export const OrderItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cart = useAppSelector((state) => state.cart.list);
  const inCart = cart.find((item) => item.id === dish?.id);
  const quantity = inCart ? inCart.quantity : 0;

  return (
    <Link
      style={{
        gap: 14,
        ...constants.flex.rowAlignCenter,
        borderRadius: 5,
        width: '100%',
        height: 80,
        position: 'relative',
        backgroundColor: constants.colors.whiteColor,
      }}
      href={`${constants.routes.dish}/${dish.id}`}
    >
      <button
        onClick={() => {
          router.push(constants.routes.dish + `?id=${dish.id}`);
        }}
      >
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: 73,
            height: 80,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            objectFit: 'cover',
          }}
        />
      </button>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <h5
          style={{
            marginBottom: 15,
            textTransform: 'capitalize',
            ...constants.typography.h5,
          }}
          className="number-of-lines-1"
        >
          {dish.name}
        </h5>
        <span style={{fontSize: 14, fontWeight: 600, marginBottom: 6}}>
          ${dish.price.toFixed(2)}
        </span>
        <div
          style={{
            backgroundColor: '#EEF3FC',
            padding: 10,
            borderRadius: 5,
            ...constants.flex.rowAlignCenter,
            gap: 18,
            maxWidth: 100,
            position: 'absolute',
            right: 6,
            bottom: 6,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(cartActions.removeFromCart(dish));
            }}
          >
            <svg.CounterMinusSvg />
          </button>
          <span style={{fontSize: 14}}>{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(cartActions.addToCart(dish));
            }}
          >
            <svg.CounterPlusSvg />
          </button>
        </div>
      </div>
    </Link>
  );
};
