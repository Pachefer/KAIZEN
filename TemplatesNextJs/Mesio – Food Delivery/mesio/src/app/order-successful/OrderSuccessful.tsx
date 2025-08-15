'use client';

import React, {useEffect} from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';

export const OrderSuccessful: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(cartActions.resetCart());
  }, []);

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          ...constants.flex.column,
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: 36}}
        >
          <svg.SuccessSvg />
        </div>
        <h2
          style={{
            ...constants.typography.h2,
            textTransform: 'capitalize',
            marginBottom: 10,
            marginLeft: 'auto',
            marginRight: 'auto',
            color: constants.colors.seaGreenColor,
          }}
        >
          Order successful!
        </h2>
        <p
          style={{
            maxWidth: 274,
            textAlign: 'center',
            fontSize: 16,
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 20,
            color: constants.colors.textColor,
          }}
        >
          Your order will be delivered on time. <br />
          Thank you!
        </p>
        <components.Button
          label="View orders"
          containerStyle={{marginBottom: 15}}
          onClickAction={() => {
            router.push(constants.routes.orderHistory);
          }}
        />
        <components.Button
          label="Continue Shopping"
          colorScheme="secondary"
          onClickAction={() => {
            router.push(constants.routes.home);
          }}
        />
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>{renderContent()}</components.SafeAreaView>
    </components.MotionWrapper>
  );
};
