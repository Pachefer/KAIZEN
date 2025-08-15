'use client';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

import React, {useState, useEffect} from 'react';
import {AnimatePresence, motion} from 'framer-motion';

import {svg} from '@/assets/svg';

export const Statistics: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const statuses = ['Income', 'Expenses'];
  const cards = [
    {
      id: 1,
      number: '**** **** **** 7895',
      balance: '4 863.27 USD',
      transitions: [
        {
          category: 'Money transfer',
          transactions: 36,
          amount: -7923.52,
          percentage: 68,
          icon: svg.TransferSvg,
        },
        {
          category: 'Food products',
          transactions: 18,
          amount: -1398.27,
          percentage: 12,
          icon: svg.ShoppingCartSvg,
        },
        {
          category: 'Cafe and restaurants',
          transactions: 12,
          amount: -932.18,
          percentage: 8,
          icon: svg.CoffeeSvg,
        },
        {
          category: 'Medical supplies',
          note: 'Money transfer',
          amount: -466.09,
          percentage: 88,
          icon: svg.MedicalPlusSvg,
        },
      ],
    },
    {
      id: 2,
      number: '**** **** **** 8456',
      balance: '2 156.35 USD',
      transitions: [
        {
          category: 'Online shopping',
          transactions: 22,
          amount: -1543.75,
          percentage: 71,
          icon: svg.TransferSvg,
        },
        {
          category: 'Groceries',
          transactions: 9,
          amount: -389.12,
          percentage: 18,
          icon: svg.ShoppingCartSvg,
        },
        {
          category: 'Entertainment',
          transactions: 5,
          amount: -156.48,
          percentage: 7,
          icon: svg.CoffeeSvg,
        },
        {
          category: 'Insurance',
          note: 'Monthly payment',
          amount: -67.0,
          percentage: 4,
          icon: svg.MedicalPlusSvg,
        },
      ],
    },
  ];

  const [selectedStatus, setSelectedStatus] = useState(statuses[0]);
  const [selectedCard, setSelectedCard] = useState(cards[0]);
  const [showBottomModal, setShowBottomModal] = useState(false);

  useEffect(() => {
    let metaTag = document.querySelector('meta[name="theme-color"]');
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute('name', 'theme-color');
      document.head.appendChild(metaTag);
    }

    if (showBottomModal) {
      metaTag.setAttribute('content', '#767879');
    } else {
      metaTag.setAttribute('content', '#EDF0F2');
    }
  }, [showBottomModal]);

  const renderBackground = () => {
    return (
      <img
        src={'/bg/03.png'}
        alt="bg"
        style={{
          position: 'absolute',
          width: '100%',
          height: 'auto',
          zIndex: 1,
          maxWidth: constants.sizes.screenWidth,
          margin: '0 auto',
          left: 0,
          right: 0,
        }}
      />
    );
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        title="Statistics"
        containerStyle={{
          backgroundColor: constants.colors.antiFlashWhite,
          zIndex: 3,
        }}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          padding: 20,
          overflowY: 'auto',
          zIndex: 2,
          marginTop: constants.sizes.headerHeight,
        }}
      >
        {/* Statuses */}
        <section>
          <ul
            style={{
              backgroundColor: constants.colors.whiteColor,
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              borderRadius: 5,
              padding: 2,
              marginBottom: 30,
            }}
          >
            {statuses.map((status, index) => {
              return (
                <li key={index} style={{width: '100%'}}>
                  <button
                    style={{
                      width: '100%',
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingTop: 3,
                      paddingBottom: 3,
                      background:
                        selectedStatus === status
                          ? 'linear-gradient(91.28deg, #97daff 0%, #16579d 100%)'
                          : constants.colors.whiteColor,
                    }}
                    onClick={() => setSelectedStatus(status)}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color:
                          selectedStatus === status
                            ? constants.colors.whiteColor
                            : constants.colors.mainDarkColor,
                      }}
                    >
                      {status}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Date with card */}
        <section style={{marginBottom: 30}}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              marginBottom: 14,
            }}
          >
            <span>Sep 1 - Sep 20, 2022</span>
            <svg.CalendarSvg />
          </div>
          <div
            style={{
              padding: 12,
              backgroundColor: '#fff',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              width: '100%',
              cursor: 'pointer',
            }}
            onClick={() => setShowBottomModal(true)}
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
                {selectedCard.number}
              </span>
              <h6 style={{...constants.typography.h6}}>
                {selectedCard.balance}
              </h6>
            </div>
            <svg.MoreVerticalSvg />
          </div>
        </section>

        {/* Chart */}
        <section style={{marginBottom: 13}}>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <svg.ChartSvg />
          </div>
        </section>

        {/* Total */}
        <section style={{textAlign: 'center', marginBottom: 19}}>
          <span style={{fontSize: 32, fontWeight: 600, display: 'block'}}>
            - $ 11 654.<span style={{fontSize: 24, fontWeight: 600}}>24</span>
          </span>
        </section>

        {/* Transactions */}
        <section>
          <ul
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            {selectedCard.transitions.map((transaction, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 10,
                    backgroundColor: constants.colors.whiteColor,
                    borderRadius: 10,
                    width: '100%',
                    gap: 14,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    alert(`Selected transaction: ${transaction.category}`);
                  }}
                >
                  <>
                    <transaction.icon />
                  </>
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      flexDirection: 'column',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <h6 style={{lineHeight: 1.2}}>{transaction.category}</h6>
                      <h6>{transaction.amount.toFixed(2)}</h6>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        {transaction.transactions} stransactions
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          textAlign: 'right',
                          color: constants.colors.bodyTextColor,
                        }}
                      >
                        {transaction.percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </section>
      </main>
    );
  };

  const renderOverlay = () => {
    return (
      <AnimatePresence>
        {showBottomModal && (
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.4, ease: 'easeInOut'}}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 9000,
            }}
            onClick={() => setShowBottomModal(false)}
          />
        )}
      </AnimatePresence>
    );
  };

  const renderBottomModal = () => {
    return (
      <AnimatePresence>
        {showBottomModal && (
          <motion.div
            initial={{y: '100%'}}
            animate={{y: 0}}
            exit={{y: '100%'}}
            transition={{type: 'keyframes', stiffness: 300, damping: 30}}
            style={{
              position: 'fixed',
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              background: constants.colors.antiFlashWhite,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 30,
              paddingLeft: 20,
              paddingRight: 20,
              maxWidth: constants.sizes.screenWidth,
              margin: '0 auto',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)',
            }}
          >
            <h4
              style={{
                textAlign: 'center',
                marginBottom: 20,
                ...constants.typography.h4,
              }}
            >
              Choose card
            </h4>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                marginBottom: 30,
              }}
            >
              {cards.map((card) => {
                return (
                  <div
                    key={card.id}
                    style={{
                      padding: 12,
                      backgroundColor: constants.colors.whiteColor,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      width: '100%',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedCard(card)}
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
                      <h6 style={{...constants.typography.h6}}>
                        {card.balance}
                      </h6>
                    </div>
                    <div
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
                      {selectedCard.id === card.id && (
                        <div
                          style={{
                            backgroundColor: '#3eb290',
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </ul>
            <components.Button
              title="Show statistics"
              onClickAction={() => setShowBottomModal(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderBackground()}
        {renderHeader()}
        {renderContent()}
        {renderOverlay()}
        {renderBottomModal()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
