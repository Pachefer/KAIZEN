'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

type Props = {
  cardId: string;
};

export const CardDetails: React.FC<Props> = ({cardId}) => {
  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const card = constants.cards.find((card) => card.id === Number(cardId));

  const router = useRouter();

  const limits = [
    {
      id: 1,
      type: 'Online payments',
      defaultLimit: '100 USD per day',
      icon: svg.GlobeSvg,
      link: constants.routes.payments,
    },
    {
      id: 2,
      type: 'ATM withdrawals',
      defaultLimit: '3000 USD per day',
      icon: svg.DollarSignSvg,
      link: null,
    },
  ];

  const security = [
    {
      title: 'Change PIN code',
      icon: svg.KeySvg,
      link: constants.routes.changePinCode,
    },
    {
      title: 'Reissue the card',
      icon: svg.RefreshSvg,
      link: null,
    },
    {
      title: 'Block the card',
      icon: svg.LockSvg,
      link: null,
    },
    {
      title: 'Close the card',
      icon: svg.TrashSvg,
      link: null,
    },
  ];

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title="Card details"
        containerStyle={{backgroundColor: constants.colors.whiteColor}}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          marginTop: constants.sizes.headerHeight,
          paddingTop: 10,
        }}
      >
        {/* Card */}
        <section style={{marginBottom: 10}}>
          <div
            style={{
              width: '100%',
              maxWidth: 338,
              minHeight: 213,
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: 20,
              display: 'flex',
              padding: 20,
              boxSizing: 'border-box',
              flexDirection: 'column',
              margin: '0 auto',
              backgroundImage: `url('/bg/04.png')`,
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: constants.colors.whiteColor,
                letterSpacing: '0.2em',
                marginBottom: 10,
                textTransform: 'uppercase',
              }}
            >
              teofin platinum
            </span>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'auto',
              }}
            >
              <span
                style={{
                  color: constants.colors.whiteColor,
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                {card?.number}
              </span>
              <svg.CVVSvg />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 8,
                  textTransform: 'uppercase',
                }}
              >
                balance
              </span>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: 8,
                  textTransform: 'uppercase',
                }}
              >
                expire
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  color: constants.colors.whiteColor,
                  fontSize: 22,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                {card?.balance}
              </span>
              <span
                style={{
                  color: constants.colors.whiteColor,
                  fontSize: 12,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                12/24
              </span>
            </div>
          </div>
        </section>

        {/* Limits */}
        <section style={{marginBottom: 20}}>
          <span
            style={{
              fontSize: 12,
              color: constants.colors.bodyTextColor,
            }}
          >
            Limits
          </span>
          <ul>
            {limits.map((limit) => {
              return <items.LimitItem key={limit.id} limit={limit} />;
            })}
          </ul>
        </section>

        {/* Security */}
        <section>
          <span
            style={{
              fontSize: 12,
              color: constants.colors.bodyTextColor,
              marginBottom: 4,
              display: 'block',
            }}
          >
            Security
          </span>
          <ul style={{display: 'flex', flexDirection: 'column'}}>
            {security.map((item) => {
              return (
                <li key={item.title}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      paddingBottom: 18,
                      paddingTop: 18,
                      gap: 10,
                      borderBottom: '1px solid #ced6e1',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (item.link) {
                        router.push(item.link);
                      } else {
                        alert('This feature is not available yet.');
                      }
                    }}
                  >
                    <item.icon />
                    <h5
                      style={{
                        ...constants.typography.h5,
                        marginRight: 'auto',
                        color:
                          item.title === 'Block the card' ||
                          item.title === 'Close the card'
                            ? constants.colors.linkColor
                            : constants.colors.mainDarkColor,
                      }}
                    >
                      {item.title}
                    </h5>
                    <svg.RightArrowSvg />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
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
