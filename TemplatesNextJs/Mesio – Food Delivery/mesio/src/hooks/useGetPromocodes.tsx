'use client';

import axios from 'axios';
import {useEffect, useState} from 'react';

import {URLS} from '@/config';

export const useGetPromocodes = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getPromocodes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URLS.GET_PROMOCODES);

      if (!response.data) {
        throw new Error('No data in response');
      }

      const promocodes = response.data.promocodes || response.data || [];
      setPromocodes(promocodes);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('API request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPromocodes();
  }, []);

  return {promocodes, isLoading};
};
