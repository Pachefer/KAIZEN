'use client';

import {useRouter} from 'next/navigation';
import React, {useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const IbanPayment: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const router = useRouter();

  const [form, setForm] = useState({
    iban: '',
    beneficiaryName: '',
    bicCode: '',
    beneficiaryBank: '',
    amount: '',
    comment: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const cards = [
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1945',
      balance: '2 648.11 USD',
    },
    {
      id: 2,
      type: 'Visa',
      number: '**** **** **** 7895',
      balance: '4 863.27 USD',
    },
  ];

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="IBAN payment" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          marginTop: constants.sizes.headerHeight,
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* Use card */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 12,
              color: constants.colors.bodyTextColor,
            }}
          >
            Use card:
          </span>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {cards.map((card) => {
              return (
                <li key={card.id}>
                  <div
                    style={{
                      width: '100%',
                      padding: 12,
                      backgroundColor: constants.colors.whiteColor,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      border:
                        '1px solid ' +
                        (selectedCard === card.id
                          ? '#789dcb'
                          : constants.colors.antiFlashWhite),
                      transition: 'border 0.2s',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedCard(card.id);
                    }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        background:
                          'linear-gradient(110.75deg, #c285ab 0%, #7aa1ce 49.34%, #1b1f6a 100.78%)',
                        width: 72,
                        height: 46,
                        borderRadius: 5,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                      }}
                    >
                      <span
                        style={{
                          color: constants.colors.whiteColor,
                          fontSize: 12,
                          margin: 10,
                          marginBottom: 8,
                          fontWeight: 600,
                        }}
                      >
                        teofin
                      </span>
                    </div>
                    {/* Details */}
                    <>
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        {card.number}
                      </span>
                      <br />
                      <h6 style={{...constants.typography.h6}}>
                        {card.balance}
                      </h6>
                    </>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Beneficiary info: */}
        <section>
          <span
            style={{
              display: 'block',
              marginBottom: 6,
              fontSize: 12,
              color: constants.colors.bodyTextColor,
            }}
          >
            Beneficiary info::
          </span>
          <div style={{marginBottom: 14}}>
            <components.InputField
              placeholder="IBAN number"
              value={form.iban}
              onClickAction={() => handleChangeField('iban', 'IBAN number')}
            />
          </div>
          <div style={{marginBottom: 14}}>
            <components.InputField
              placeholder="Beneficiary name"
              value={form.beneficiaryName}
              onClickAction={() =>
                handleChangeField('beneficiaryName', 'beneficiary name')
              }
            />
          </div>
          <div style={{marginBottom: 14}}>
            <components.InputField
              placeholder="BIC code"
              value={form.bicCode}
              onClickAction={() => handleChangeField('bicCode', 'BIC code')}
            />
          </div>
          <div style={{marginBottom: 14}}>
            <components.InputField
              placeholder="Beneficiary bank"
              value={form.beneficiaryBank}
              onClickAction={() =>
                handleChangeField('beneficiaryBank', 'beneficiary bank')
              }
            />
          </div>
          <div style={{marginBottom: 14}}>
            <components.InputField
              placeholder="Amount"
              value={form.amount}
              onClickAction={() => handleChangeField('amount', 'amount')}
            />
          </div>
          <div
            style={{
              minHeight: 100,
              alignItems: 'flex-start',
              paddingBottom: 14,
              marginBottom: 0,
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <components.InputField
              placeholder="Comment"
              value={form.comment}
              containerStyle={{
                height: 120,
                alignItems: 'flex-start',
                paddingTop: 12,
              }}
              onClickAction={() => handleChangeField('comment', 'comment')}
            />
          </div>
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <div
        style={{
          padding: 20,
        }}
      >
        <components.Button
          title="Send"
          onClickAction={() => {
            router.replace(constants.routes.paymentSuccess);
          }}
        />
      </div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderButton()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
