'use client';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'motion/react';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const FAQ: React.FC = () => {
  const faq = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer:
        'Select a restaurant and dishes, add them to your cart, and proceed to checkout. Enter your address and payment method. After confirming, you can track your order status in the app.',
    },
    {
      id: 2,
      question: 'Can I pay for my order online?',
      answer:
        'Yes, you can pay online using a bank card, Apple Pay, Google Pay, or choose to pay cash to the courier upon delivery.',
    },
    {
      id: 3,
      question: 'How do I use a promo code?',
      answer:
        'Enter your promo code in the special field at checkout. If the promo code is valid, the discount will be applied automatically.',
    },
    {
      id: 4,
      question: 'How can I track my courier?',
      answer:
        'After placing your order, you will see the courier’s location on the map and can track their route in real time.',
    },
    {
      id: 5,
      question: 'What should I do if my order is delayed?',
      answer:
        'If your order is delayed, contact support via the in-app chat or by phone listed in the "Contacts" section. We will help resolve your issue.',
    },
    {
      id: 6,
      question: 'Can I cancel my order?',
      answer:
        'You can cancel your order before the restaurant starts preparing it. Go to "My Orders" and select the order you want to cancel.',
    },
    {
      id: 7,
      question: 'How do I leave feedback about my order?',
      answer:
        'After receiving your order, you can leave feedback and a rating in the "My Orders" section. Your opinion is important and helps us improve our service!',
    },
  ];

  const [openId, setOpenId] = useState<number | null>(null);

  const renderHeader = () => (
    <components.Header showGoBack={true} title="FAQ" />
  );

  const renderContent = () => (
    <main
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: constants.sizes.headerHeight,
        paddingTop: 10,
      }}
    >
      <div>
        {faq.map((item) => (
          <div key={item.id}>
            <div
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 9,
                borderBottom: '1px solid #E0E0E0',
                marginBottom: 13,
                marginTop: 14,
              }}
            >
              <h5
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                  color: constants.colors.mainDarkColor,
                }}
              >
                {item.question}
              </h5>
              {openId === item.id ? (
                <svg.OpenArrowSvg />
              ) : (
                <svg.CloseArrowSvg />
              )}
            </div>
            <AnimatePresence initial={false}>
              {openId === item.id && (
                <motion.div
                  key="content"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{duration: 0.3, ease: [0.87, 0, 0.13, 1]}}
                  layout
                  style={{
                    overflow: 'hidden',
                    marginTop: 8,
                    marginBottom: 8,
                  }}
                >
                  <p style={{color: constants.colors.textColor, fontSize: 16}}>
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </main>
  );

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
