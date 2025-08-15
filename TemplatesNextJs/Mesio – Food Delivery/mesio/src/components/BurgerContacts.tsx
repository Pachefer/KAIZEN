'use client';

import React from 'react';
import {motion} from 'framer-motion';

import {constants} from '@/constants';
import {useAppDispatch} from '@/lib/store';
import {useAppSelector} from '@/lib/store';
import {modalActions} from '@/lib/modalSlice';

const menuItems = [
  {
    id: 1,
    titleLine1: '27 Division St, New York,',
    titleLine2: 'NY 10002, USA',
  },
  {
    id: 2,
    titleLine1: 'spinridesale@mail.com',
    titleLine2: 'spinridesupport@mail.com',
  },
  {
    id: 3,
    titleLine1: '+17  123456789',
    titleLine2: '+17  987654321',
  },
];

export const BurgerContacts: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.modalSlice.isOpen);
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
      transition={{duration: 0.3}}
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: '100%',
        position: 'fixed',
        zIndex: 9999,
        maxWidth: 'var(--screen-width)',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
      onClick={() => dispatch(modalActions.setIsOpen(false))}
    >
      <motion.div
        initial={{x: '-100%'}}
        animate={{x: -1}}
        transition={{type: 'spring', stiffness: 300, damping: 30}}
        style={{
          maxWidth: 270,
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: '10%',
          backgroundColor: '#fff',
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <h2
          style={{
            color: constants.colors.mainDarkColor,
            textTransform: 'capitalize',
            marginBottom: 30,
            fontSize: 20,
            fontWeight: 500,
          }}
        >
          Contact us
        </h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {menuItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderBottom: '1px solid rgba(219, 227, 245, 0.5)',
                paddingBottom: 26,
              }}
            >
              <div
                style={{
                  marginLeft: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <span style={{fontSize: 14, color: constants.colors.textColor}}>
                  {item.titleLine1}
                </span>
                <span style={{fontSize: 14, color: constants.colors.textColor}}>
                  {item.titleLine2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
