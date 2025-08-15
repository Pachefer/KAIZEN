'use client';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

import {constants} from '@/constants';
import {components} from '@/components';

const orders = [
  {
    id: 456345,
    date: 'Aug 31, 2023',
    time: '8:32 pm',
    status: 'shipping',
    total: 14.4,
    discount: 2.65,
    delivery: 2,
    dishes: [
      {
        id: 1,
        name: 'Mushroom Soup',
        quantity: 1,
        price: 7.5,
      },
      {
        id: 2,
        name: 'Noodle Soup',
        quantity: 1,
        price: 6.9,
      },
    ],
  },
  {
    id: 456346,
    date: 'Jul 28, 2023',
    time: '8:32 pm',
    status: 'delivered',
    total: 14.4,
    discount: 2.65,
    delivery: 2,
    dishes: [
      {
        id: 1,
        name: 'Mushroom Soup',
        quantity: 1,
        price: 7.5,
      },
      {
        id: 2,
        name: 'Noodle Soup',
        quantity: 1,
        price: 6.9,
      },
    ],
  },
  {
    id: 456347,
    date: 'Jun 11, 2023',
    time: '8:32 pm',
    status: 'canceled',
    total: 14.4,
    discount: 2.65,
    delivery: 2,
    dishes: [
      {
        id: 1,
        name: 'Mushroom Soup',
        quantity: 1,
        price: 7.5,
      },
      {
        id: 2,
        name: 'Noodle Soup',
        quantity: 1,
        price: 6.9,
      },
    ],
  },
];

export const OrderHistory: React.FC = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const renderHeader = () => {
    return <components.Header title="Order History" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          overflowY: 'auto',
          paddingLeft: 20,
          paddingRight: 20,
          marginTop: constants.sizes.headerHeight,
          paddingTop: 18,
          paddingBottom: 20,
        }}
      >
        <ul style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {orders.map((item: any) => (
            <li
              key={item.id}
              style={{
                backgroundColor: constants.colors.whiteColor,
                borderRadius: 10,
                ...constants.styles.boxShadow,
              }}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <section
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 20,
                  paddingBottom: 20,
                  borderBottom: `1px solid ${
                    openId === item.id ? '#EEEEEE' : 'transparent'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    WebkitJustifyContent: 'space-between',
                    marginBottom: 7,
                  }}
                >
                  <h5 style={{fontSize: 12}}>#{item.id}</h5>
                  {item.status === 'shipping' && (
                    <span
                      style={{
                        fontSize: 12,
                        color: '#FFC700',
                      }}
                    >
                      Shipping
                    </span>
                  )}
                  {item.status === 'canceled' && (
                    <span
                      style={{
                        fontSize: 12,
                        color: constants.colors.redColor,
                      }}
                    >
                      Canceled
                    </span>
                  )}
                  {item.status === 'delivered' && (
                    <span
                      style={{
                        fontSize: 12,
                        color: constants.colors.seaGreenColor,
                      }}
                    >
                      Delivered
                    </span>
                  )}
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
                      fontSize: 12,
                      color: constants.colors.textColor,
                    }}
                  >
                    {item.date} at {item.time}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: constants.colors.mainDarkColor,
                    }}
                  >
                    ${item.total}
                  </span>
                </div>
              </section>
              <AnimatePresence initial={false}>
                {openId === item.id && (
                  <motion.section
                    key="content"
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: 0.3, ease: [0.87, 0, 0.13, 1]}}
                  >
                    <ul
                      style={{
                        padding: 20,
                        gap: 6,
                        ...constants.flex.column,
                      }}
                    >
                      {item.dishes.map((product: any) => {
                        return (
                          <li
                            key={product.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}
                          >
                            <span
                              style={{
                                fontSize: 14,
                                color: constants.colors.textColor,
                              }}
                            >
                              {product.name}
                            </span>
                            <span
                              style={{
                                fontSize: 14,
                                color: constants.colors.textColor,
                              }}
                            >
                              {product.quantity} x ${product.price}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.section>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
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
