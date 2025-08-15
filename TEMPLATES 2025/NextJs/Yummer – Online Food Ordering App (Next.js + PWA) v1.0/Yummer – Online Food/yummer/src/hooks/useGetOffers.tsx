'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';

export const useGetOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URLS.GET_OFFERS);

      if (!response.data) {
        throw new Error('No data in response');
      }

      const offers = response.data.offers || response.data || [];
      setOffers(offers);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  return {offers, loading};
};
