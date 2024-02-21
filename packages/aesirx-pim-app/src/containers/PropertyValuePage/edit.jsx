/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditPropertyValue from './PropertyValueEdit';
import { PropertyValueViewModelContextProvider } from './PropertyValueViewModel/PropertyValueViewModelContextProvider';

const EditPropertyValueProvider = observer(
  class EditPropertyValueProvider extends Component {
    render() {
      return (
        <PropertyValueViewModelContextProvider>
          <EditPropertyValue />
        </PropertyValueViewModelContextProvider>
      );
    }
  }
);
export default EditPropertyValueProvider;
