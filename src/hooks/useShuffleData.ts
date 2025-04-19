import { useState, useCallback, useEffect } from 'react';

/**
 * A hook that provides a randomized subset of data with a shuffle function
 * @template T - The type of items in the data array
 * @param data - The array of data to shuffle
 * @param length - The maximum number of items to include in the result
 * @returns An object containing the randomized data and a function to shuffle it
 */
export function useShuffleData<T>(data: T[], length: number = data.length) {
  const [randomizedData, setRandomizedData] = useState<T[]>([]);

  // Function to shuffle the data array using Fisher-Yates algorithm
  const shuffleData = useCallback(() => {
    if (!data || data.length === 0) {
      setRandomizedData([]);
      return;
    }
    
    // Create a copy of the array to avoid mutating the original
    const tempArray = [...data];
    
    // Fisher-Yates shuffle algorithm (more efficient than sort with random)
    for (let i = tempArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
    }
    
    // Take only the requested number of items
    setRandomizedData(tempArray.slice(0, length));
  }, [data, length]);

  // Initialize randomizedData when data or length changes
  useEffect(() => {
    if (data && data.length > 0) {
      // For initial state, just take the first 'length' items without shuffling
      setRandomizedData(data.slice(0, length));
    } else {
      setRandomizedData([]);
    }
  }, [data, length]);

  return { 
    randomizedData, 
    shuffleData,
    reset: useCallback(() => setRandomizedData(data.slice(0, length)), [data, length])
  };
}
