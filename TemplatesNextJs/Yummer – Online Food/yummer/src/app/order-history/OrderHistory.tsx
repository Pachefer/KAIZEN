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
        name: 'Tonkotsu Ramen',
        quantity: 1,
        price: 7.5,
      },
      {
        id: 2,
        name: 'Classic Cheeseburger',
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
    total: 17.0,
    discount: 3.0,
    delivery: 2,
    dishes: [
      {
        id: 3,
        name: 'Salmon Roll',
        quantity: 1,
        price: 9.5,
      },
      {
        id: 4,
        name: 'Chocolate Cupcake',
        quantity: 1,
        price: 5.5,
      },
    ],
  },
  {
    id: 456347,
    date: 'Jun 11, 2023',
    time: '8:32 pm',
    status: 'canceled',
    total: 15.8,
    discount: 2.8,
    delivery: 2,
    dishes: [
      {
        id: 7,
        name: 'A Plate of Pancakes',
        quantity: 1,
        price: 7.8,
      },
      {
        id: 8,
        name: 'Borscht',
        quantity: 1,
        price: 8.0,
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
                borderRadius: 5,
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
                        color: constants.colors.mainColor2,
                      }}
                    >
                      Canceled
                    </span>
                  )}
                  {item.status === 'delivered' && <span>Delivered</span>}
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
                        ...constants.flex.flexColumn,
                      }}
                    >
                      {item.dishes.map((product: any) => {
                        return (
                          <li
                            key={product.id}
                            style={{
                              ...constants.flex.rowCenterBetween,
                            }}
                          >
                            <span style={{fontSize: 14}}>{product.name}</span>
                            <span style={{fontSize: 14}}>
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
