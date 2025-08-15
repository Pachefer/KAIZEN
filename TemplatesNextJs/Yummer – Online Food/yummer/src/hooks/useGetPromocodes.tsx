'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';

export const useGetPromocodes = () => {
  const [promocodes, setPromocodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPromocodes = async () => {
    setLoading(true);

    try {
      const response = await axios.get(URLS.GET_PROMOCODES);
      if (!response.data) {
        throw new Error('No data in response');
      }
      const promocodes = response.data.promocodes || response.data || [];
      setPromocodes(promocodes);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPromocodes();
  }, []);

  return {promocodes, loading};
};
