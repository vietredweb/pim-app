/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React from 'react';
import { PropertyValueStore } from '../store';
import PropertyValueViewModel from './PropertyValueViewModel';

const propertyValueStore = new PropertyValueStore();
const propertyValueViewModel = new PropertyValueViewModel(propertyValueStore);

export const PropertyValueViewModelContext = React.createContext({
  model: propertyValueViewModel,
});

export const PropertyValueViewModelContextProvider = ({ children }) => {
  return (
    <PropertyValueViewModelContext.Provider value={{ model: propertyValueViewModel }}>
      {children}
    </PropertyValueViewModelContext.Provider>
  );
};

/* Hook to use store in any functional component */
export const usePropertyValueViewModel = () => React.useContext(PropertyValueViewModelContext);

/* HOC to inject store to any functional or class component */
export const withPropertyValueViewModel = (Component) => (props) => {
  return <Component {...props} {...usePropertyValueViewModel()} />;
};
