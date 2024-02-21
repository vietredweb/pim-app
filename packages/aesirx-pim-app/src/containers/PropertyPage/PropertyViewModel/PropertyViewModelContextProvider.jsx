/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { PropertyStore } from '../store';
import PropertyViewModel from './PropertyViewModel';

const propertyStore = new PropertyStore();
const propertyViewModel = new PropertyViewModel(propertyStore);

export const PropertyViewModelContext = React.createContext({
  model: propertyViewModel,
});

export const PropertyViewModelContextProvider = ({ children }) => {
  return (
    <PropertyViewModelContext.Provider value={{ model: propertyViewModel }}>
      {children}
    </PropertyViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePropertyViewModel = () => React.useContext(PropertyViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPropertyViewModel = (Component) => (props) => {
  return <Component {...props} {...usePropertyViewModel()} />;
};
