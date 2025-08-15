'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';

export const Checkout: React.FC = () => {
  const router = useRouter();
  const {list: cart, total} = useAppSelector((state) => state.cart);

  const {form, handleChangeField} = hooks.useFormField({
    fullName: '',
    address: '',
    phoneNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Checkout" />;
  };

  const renderOrderSummary = () => {
    return (
      <section
        style={{
          ...constants.styles.boxShadow,
          padding: 20,
          borderRadius: 10,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 14,
            paddingBottom: 14,
            borderBottom: '1px solid #f0f0f0ff',
          }}
        >
          <h4
            style={{
              fontSize: 18,
              color: constants.colors.mainDarkColor,
              textTransform: 'capitalize',
            }}
          >
            my order
          </h4>
          <span
            style={{
              fontSize: 18,
              color: constants.colors.mainDarkColor,
              textTransform: 'capitalize',
            }}
          >
            ${total.toFixed(2)}
          </span>
        </div>
        <ul style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          {cart.map((dish: DishType, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{fontSize: 14, color: constants.colors.textColor}}>
                {dish.name}
              </span>
              <span style={{fontSize: 14, color: constants.colors.textColor}}>
                {dish.quantity} x ${dish.price.toFixed(2)}
              </span>
            </div>
          ))}
        </ul>
      </section>
    );
  };

  const renderShippingDetails = () => {
    return (
      <section style={{marginBottom: 20}}>
        <h4 style={{marginBottom: 14}}>Shipping Details</h4>
        <components.Input
          placeholder="Full Name"
          value={form.fullName}
          containerStyle={{marginBottom: 10}}
          onClickAction={() => handleChangeField('fullName', 'fullName')}
        />
        <components.Input
          placeholder="Address"
          containerStyle={{marginBottom: 10}}
          value={form.address}
          onClickAction={() => handleChangeField('address', 'address')}
        />
        <components.Input
          placeholder="Phone Number"
          containerStyle={{marginBottom: 10}}
          value={form.phoneNumber}
          onClickAction={() => handleChangeField('phoneNumber', 'phoneNumber')}
        />
      </section>
    );
  };

  const renderCardDetails = () => {
    return (
      <section style={{marginBottom: 20}}>
        <p style={{marginBottom: 14}}>Card Details</p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <components.Input
            value={form.cardNumber}
            placeholder="Enter your card number"
            onClickAction={() => handleChangeField('cardNumber', 'Card Number')}
          />
          <components.Input
            value={form.expiryDate}
            placeholder="MM/YY"
            onClickAction={() => handleChangeField('expiryDate', 'MM/YY')}
          />
          <components.Input
            value={form.cvv}
            placeholder="CVV"
            onClickAction={() => handleChangeField('cvv', 'CVV')}
          />
        </div>
      </section>
    );
  };

  const renderButton = () => {
    return (
      <components.Button
        label="Place Order"
        onClickAction={() => {
          router.push(constants.routes.orderSuccessful);
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          padding: 20,
          overflowY: 'auto',
        }}
      >
        {renderOrderSummary()}
        {renderShippingDetails()}
        {renderCardDetails()}
        {renderButton()}
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
