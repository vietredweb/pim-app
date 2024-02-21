import { PIM_VARIANT_DETAIL_FIELD_KEY } from 'aesirx-lib';
/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
class VariantDetailViewModel {
  formStatus = PAGE_STATUS.READY;
  variantDetailViewModel = { formPropsData: [{}] };
  aliasChange = '';
  variantList = [];
  successResponse = {
    state: true,
    content_id: '',
    filters: { limit: 0 },
  };

  constructor(variantStore) {
    makeAutoObservable(this);
    this.variantStore = variantStore;
  }

  setForm = (variantDetailViewModel) => {
    this.variantDetailViewModel = variantDetailViewModel;
  };

  initializeData = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.variantStore.getDetail(
      this.variantDetailViewModel.formPropsData[PIM_VARIANT_DETAIL_FIELD_KEY.ID]
    );

    runInAction(() => {
      if (!data?.error) {
        this.onGetVariantSuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  getVariantList = async () => {
    runInAction(() => {
      this.formStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.variantStore.getList(this.successResponse.filters);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, '');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  create = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.variantStore.create(this.variantDetailViewModel.formPropsData);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, 'Created successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
    return data;
  };

  update = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.variantStore.update(this.variantDetailViewModel.formPropsData);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, 'Updated successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
    return data;
  };

  onErrorHandler = (error) => {
    Array.isArray(error?._messages) && error?._messages[0]?.message
      ? notify(error?._messages[0]?.message, 'error')
      : error?.message && notify(error?.message, 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error?.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
    if (result?.listItems) {
      this.variantList = result?.listItems;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  onGetVariantSuccessHandler = (result) => {
    if (result && result[PIM_VARIANT_DETAIL_FIELD_KEY.ID]) {
      this.variantDetailViewModel.formPropsData = {
        ...this.variantDetailViewModel.formPropsData,
        ...Object.keys(PIM_VARIANT_DETAIL_FIELD_KEY)
          .map((index) => {
            return {
              [PIM_VARIANT_DETAIL_FIELD_KEY[index]]: result[PIM_VARIANT_DETAIL_FIELD_KEY[index]],
            };
          })
          .reduce((prev, cur) => ({ ...prev, ...cur })),
      };
      this.formStatus = PAGE_STATUS.READY;
    }
  };

  onGetVariantListSuccessHandler = (result) => {
    if (result) {
      this.variantList = result;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  handleFormPropsData = (key, value) => {
    if (key && value !== null) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(this.variantDetailViewModel.formPropsData[key], value);
      } else {
        this.variantDetailViewModel.formPropsData[key] = value;
      }
    }
  };
  handleAliasChange = (value) => {
    this.aliasChange = value;
  };
}

export default VariantDetailViewModel;
