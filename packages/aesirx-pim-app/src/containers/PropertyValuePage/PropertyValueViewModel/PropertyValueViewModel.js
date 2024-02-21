/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PropertyValueDetailViewModel from './PropertyValueDetailViewModel';
import PropertyValueListViewModel from './PropertyValueListViewModel';

class PropertyValueViewModel {
  propertyValueDetailViewModel = {};
  propertyValueListViewModel = {};

  constructor(propertyValueStore) {
    if (propertyValueStore) {
      this.propertyValueDetailViewModel = new PropertyValueDetailViewModel(propertyValueStore);
      this.propertyValueListViewModel = new PropertyValueListViewModel(propertyValueStore);
    }
  }

  getPropertyValueDetailViewModel = () => this.propertyValueDetailViewModel;
  getPropertyValueListViewModel = () => this.propertyValueListViewModel;
}

export default PropertyValueViewModel;
