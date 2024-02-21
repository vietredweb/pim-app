/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { observer } from 'mobx-react';
import EditVariant from './VariantEdit';
import { VariantViewModelContextProvider } from './VariantViewModel/VariantViewModelContextProvider';

const EditVariantProvider = observer(
  class EditVariantProvider extends Component {
    render() {
      return (
        <VariantViewModelContextProvider>
          <EditVariant />
        </VariantViewModelContextProvider>
      );
    }
  }
);
export default EditVariantProvider;
