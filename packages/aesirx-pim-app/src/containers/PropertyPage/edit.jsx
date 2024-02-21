/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditProperty from './PropertyEdit';
import { PropertyViewModelContextProvider } from './PropertyViewModel/PropertyViewModelContextProvider';

const EditPropertyProvider = observer(
  class EditPropertyProvider extends Component {
    render() {
      return (
        <PropertyViewModelContextProvider>
          <EditProperty />
        </PropertyViewModelContextProvider>
      );
    }
  }
);
export default EditPropertyProvider;
