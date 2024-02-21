/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { VariantStore } from '../store';
import VariantViewModel from './VariantViewModel';

const variantStore = new VariantStore();
const variantViewModel = new VariantViewModel(variantStore);

export const VariantViewModelContext = React.createContext({
  model: variantViewModel,
});

export const VariantViewModelContextProvider = ({ children }) => {
  return (
    <VariantViewModelContext.Provider value={{ model: variantViewModel }}>
      {children}
    </VariantViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const useVariantViewModel = () => React.useContext(VariantViewModelContext);

/* HOC to inject store to any functional or class component */
export const withVariantViewModel = (Component) => (props) => {
  return <Component {...props} {...useVariantViewModel()} />;
};
