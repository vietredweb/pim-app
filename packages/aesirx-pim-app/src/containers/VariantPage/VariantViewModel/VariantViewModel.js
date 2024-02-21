/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import VariantDetailViewModel from './VariantDetailViewModel';
import VariantListViewModel from './VariantListViewModel';

class VariantViewModel {
  variantDetailViewModel = {};
  variantListViewModel = {};

  constructor(variantStore) {
    if (variantStore) {
      this.variantDetailViewModel = new VariantDetailViewModel(variantStore);
      this.variantListViewModel = new VariantListViewModel(variantStore);
    }
  }

  getVariantDetailViewModel = () => this.variantDetailViewModel;
  getVariantListViewModel = () => this.variantListViewModel;
}

export default VariantViewModel;
