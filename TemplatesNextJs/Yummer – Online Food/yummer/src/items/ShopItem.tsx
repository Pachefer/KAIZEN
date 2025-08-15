'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';

type Props = {
  dish: DishType;
};

export const ShopItem: React.FC<Props> = ({dish}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.list);
  const inCart = cart.find((item) => item.id === dish?.id);
  const quantity = inCart ? inCart.quantity : 0;

  return (
    <Link
      href={`${constants.routes.dish}/${dish.id}`}
      style={{
        borderRadius: 10,
        position: 'relative',
        backgroundColor: constants.colors.whiteColor,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        width: '100%',
      }}
    >
      <button
        onClick={() => {
          router.push(constants.routes.dish + `?id=${dish.id}`);
        }}
        style={{
          width: '100%',
          height: 130,
          overflow: 'hidden',
        }}
      >
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: '100%',
            height: 130,
            objectFit: 'cover',
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        />
      </button>
      <div
        style={{
          paddingTop: 16,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 14,
        }}
      >
        <h5
          className="number-of-lines-1"
          style={{...constants.typography.h5, marginBottom: 11}}
        >
          {dish.name}
        </h5>
        <div style={{...constants.flex.rowCenterBetween}}>
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: constants.colors.textColor,
            }}
          >
            ${dish.price.toFixed(2)}
          </span>
          <button
            style={{
              width: 26,
              height: 26,
              backgroundColor: quantity
                ? constants.colors.mainColor
                : '#EEF3FC',
              borderRadius: 4,
              ...constants.flex.columnCenterCenter,
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(cartActions.addToCart(dish));
            }}
          >
            {quantity! > 0 && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: constants.colors.whiteColor,
                }}
              >
                {quantity}
              </span>
            )}
            {!quantity && <svg.PlusSvg />}
          </button>
        </div>
      </div>
    </Link>
  );
};
