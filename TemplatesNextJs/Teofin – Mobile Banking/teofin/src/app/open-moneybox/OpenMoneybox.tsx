'use client';

import {useRouter} from 'next/navigation';
import React, {useRef, useEffect, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const OpenMoneybox: React.FC = () => {
  const router = useRouter();

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

  const buttonRef = useRef<HTMLDivElement>(null);

  const [buttonSectionHeight, setButtonSectionHeight] = useState(0);

  const [amount, setAmount] = useState(1200);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [amountPerDay, setAmountPerDay] = useState(10);
  const [selectedAmount, setSelectedAmount] = useState('per day');

  const amountParts = amount.toFixed(2).split('.');

  const [form, setForm] = useState({
    goal: '',
  });

  const handleChangeField = (field: keyof typeof form, label: string) => {
    const result = window.prompt(`Enter your ${label}`, form[field]);
    if (result !== null) {
      setForm((prev) => ({...prev, [field]: result}));
    }
  };

  useEffect(() => {
    if (buttonRef.current) {
      const height = buttonRef.current.offsetHeight;
      setButtonSectionHeight(height);
    }
  }, []);

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Open moneybox" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          paddingBottom: buttonSectionHeight + 20,
          marginTop: constants.sizes.headerHeight,
          overflowY: 'auto',
        }}
      >
        {/* The amount you want to achieve: */}
        <section style={{marginBottom: 14}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
              color: constants.colors.bodyTextColor,
            }}
          >
            The amount you want to achieve:
          </span>
          <div
            style={{
              backgroundColor: constants.colors.whiteColor,
              borderRadius: 10,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 12,
              paddingBottom: 12,
              alignSelf: 'flex-start',
              cursor: 'pointer',
            }}
            onClick={() => {
              const result = window.prompt('Enter amount', amount.toString());
              if (result !== null) {
                const parsedAmount = parseFloat(result);
                if (!isNaN(parsedAmount) && parsedAmount > 0) {
                  setAmount(parsedAmount);
                }
              }
            }}
          >
            <span style={{fontSize: 28, fontWeight: 500}}>
              ${amountParts[0]}.
              <span style={{fontSize: 16, fontWeight: 500}}>
                {amountParts[1]}
              </span>
            </span>
          </div>
        </section>

        {/* Use card: */}
        <section style={{marginBottom: 30}}>
          <span
            style={{
              fontSize: 12,
              display: 'block',
              marginBottom: 6,
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
              const isSelected = selectedCard === card.id;
              return (
                <div
                  key={card.id}
                  style={{
                    padding: 12,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    width: '100%',
                    border:
                      '1px solid ' +
                      (isSelected
                        ? 'rgba(0,0,0,0.5)'
                        : constants.colors.whiteColor),
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setSelectedCard(card.id);
                  }}
                >
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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      flexGrow: 1,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: constants.colors.bodyTextColor,
                      }}
                    >
                      {card.number}
                    </span>
                    <h6 style={{...constants.typography.h6}}>{card.balance}</h6>
                  </div>
                </div>
              );
            })}
          </ul>
        </section>

        {/* Choose period: */}
        <section style={{marginBottom: 20}}>
          <ul style={{display: 'flex', flexDirection: 'column'}}>
            <li style={{marginBottom: 10}}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onClick={() => {
                  setSelectedAmount('per day');
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #ced6e1',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedAmount === 'per day' && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#3eb290',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    backgroundColor: constants.colors.whiteColor,
                    padding: '14px 16px',
                    borderRadius: 10,
                  }}
                  onClick={() => {
                    const result = window.prompt(
                      'Enter amount per day',
                      amountPerDay.toString()
                    );
                    if (result !== null) {
                      const parsedAmount = parseFloat(result);
                      if (!isNaN(parsedAmount) && parsedAmount > 0) {
                        setAmountPerDay(parsedAmount);
                      }
                    }
                  }}
                >
                  <span style={{fontSize: 14}}>{amountPerDay.toFixed(2)}</span>
                </span>
                <span>USD per day;</span>
              </button>
            </li>
            <li style={{marginBottom: 10}}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onClick={() => {
                  setSelectedAmount('$1');
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #ced6e1',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedAmount === '$1' && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#3eb290',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </span>
                <span>Rounding up to $1 per transaction;</span>
              </button>
            </li>
            <li style={{marginBottom: 10}}>
              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
                onClick={() => {
                  setSelectedAmount('$10');
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    border: '2px solid #ced6e1',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {selectedAmount === '$10' && (
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: '#3eb290',
                        borderRadius: '50%',
                      }}
                    />
                  )}
                </span>
                <span>Rounding up to $10 per transaction.</span>
              </button>
            </li>
          </ul>
        </section>

        {/* Enter your goal */}
        <section>
          <components.InputField
            placeholder="Enter your goal"
            onClickAction={() => handleChangeField('goal', 'goal')}
            value={form.goal}
          />
        </section>
      </main>
    );
  };

  const renderButton = () => {
    return (
      <section
        ref={buttonRef}
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          padding: 20,
          bottom: 0,
          backgroundColor: constants.colors.antiFlashWhite,
        }}
      >
        <components.Button
          title="Open Moneybox"
          onClickAction={() => {
            router.back();
          }}
        />
      </section>
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
