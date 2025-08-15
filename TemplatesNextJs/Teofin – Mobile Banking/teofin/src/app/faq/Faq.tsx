'use client';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export const Faq: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const faq = [
    {
      id: 1,
      question: 'How to open an account online?',
      answer:
        'To open an account online, fill out the application form on the bank’s website and complete the identification process. After your data is verified, you will get access to your account and all banking services.',
    },
    {
      id: 2,
      question: 'Can I get a credit card in the app?',
      answer:
        'Yes, you can apply for a credit card using the bank’s mobile app. After your application is reviewed, the card will be delivered by courier or made available for pickup at a branch.',
    },
    {
      id: 3,
      question: 'How to top up my account for free?',
      answer:
        'You can top up your account without commission via our ATMs or by transferring from another bank card, if your tariff allows such operations.',
    },
    {
      id: 4,
      question: 'Do you accept international transfers?',
      answer:
        'The bank accepts international transfers via SWIFT and other payment systems. To receive a transfer, provide your account details and share the necessary information with the sender.',
    },
    {
      id: 5,
      question: 'Are there high-interest deposits?',
      answer:
        'Our bank offers various deposit options, including high-interest deposits under certain conditions. Check the latest offers on our website or in the mobile app.',
    },
    {
      id: 6,
      question: 'Where to find exchange rates?',
      answer:
        'You can find current exchange rates on the bank’s website, in the mobile app, or at any branch. Rates are updated daily and may vary depending on the type of transaction.',
    },
    {
      id: 7,
      question: 'How to contact support?',
      answer:
        'You can contact support via the hotline, chat in the mobile app, or by submitting a request through the feedback form on the bank’s website. Our specialists will respond as soon as possible.',
    },
  ];

  const [openId, setOpenId] = useState<number | null>(null);

  const renderHeader = () => (
    <components.Header showGoBack={true} title="FAQ" />
  );

  const renderContent = () => (
    <main
      style={{
        paddingTop: 20,
        marginTop: constants.sizes.headerHeight,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {faq.map((item) => (
          <div
            key={item.id}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 10,
              backgroundColor: constants.colors.whiteColor,
              overflow: 'hidden',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div
              style={{
                width: '100%',
                paddingTop: 10,
                paddingBottom: 12,
                paddingLeft: 20,
                paddingRight: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
            >
              <h5
                style={{
                  ...constants.typography.h5,
                  lineHeight: 1.6,
                  color:
                    openId === item.id
                      ? constants.colors.linkColor
                      : constants.colors.mainDarkColor,
                  transition: 'color 0.2s',
                }}
              >
                {item.question}
              </h5>
              <>
                {openId === item.id ? (
                  <svg.OpenArrowSvg />
                ) : (
                  <svg.CloseArrowSvg />
                )}
              </>
            </div>
            <AnimatePresence initial={false}>
              {openId === item.id && (
                <motion.div
                  key="content"
                  initial={{height: 0, opacity: 0}}
                  animate={{height: 'auto', opacity: 1}}
                  exit={{height: 0, opacity: 0}}
                  transition={{duration: 0.3, ease: [0.87, 0, 0.13, 1]}}
                  style={{
                    overflow: 'hidden',
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderTop: '1px solid #ced6e1',
                  }}
                >
                  <p
                    style={{
                      opacity: 1,
                      paddingTop: 14,
                      paddingBottom: 20,
                      ...constants.typography.bodyText,
                    }}
                  >
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
