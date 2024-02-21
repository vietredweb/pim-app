/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import PropertyDetailViewModel from './PropertyDetailViewModel';
import PropertyListViewModel from './PropertyListViewModel';

class PropertyViewModel {
  propertyDetailViewModel = {};
  propertyListViewModel = {};

  constructor(propertyStore) {
    if (propertyStore) {
      this.propertyDetailViewModel = new PropertyDetailViewModel(propertyStore);
      this.propertyListViewModel = new PropertyListViewModel(propertyStore);
    }
  }

  getPropertyDetailViewModel = () => this.propertyDetailViewModel;
  getPropertyListViewModel = () => this.propertyListViewModel;
}

export default PropertyViewModel;
