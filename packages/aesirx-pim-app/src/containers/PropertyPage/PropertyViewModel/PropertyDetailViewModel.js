import { PIM_PROPERTY_DETAIL_FIELD_KEY } from 'aesirx-lib';
/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PAGE_STATUS, notify } from 'aesirx-uikit';
class PropertyDetailViewModel {
  formStatus = PAGE_STATUS.READY;
  propertyDetailViewModel = { formPropsData: [{}] };
  aliasChange = '';
  propertyList = [];
  successResponse = {
    state: true,
    content_id: '',
    filters: { limit: 0 },
  };

  constructor(propertyStore) {
    makeAutoObservable(this);
    this.propertyStore = propertyStore;
  }

  setForm = (propertyDetailViewModel) => {
    this.propertyDetailViewModel = propertyDetailViewModel;
  };

  initializeData = async () => {
    this.formStatus = PAGE_STATUS.LOADING;
    const data = await this.propertyStore.getDetail(
      this.propertyDetailViewModel.formPropsData[PIM_PROPERTY_DETAIL_FIELD_KEY.ID]
    );

    runInAction(() => {
      if (!data?.error) {
        this.onGetPropertySuccessHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  getPropertyList = async () => {
    runInAction(() => {
      this.formStatus = PAGE_STATUS.LOADING;
    });
    const data = await this.propertyStore.getList(this.successResponse.filters);

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
    const data = await this.propertyStore.create(this.propertyDetailViewModel.formPropsData);

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
    const data = await this.propertyStore.update(this.propertyDetailViewModel.formPropsData);

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
      this.propertyList = result?.listItems;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  onGetPropertySuccessHandler = (result) => {
    if (result && result[PIM_PROPERTY_DETAIL_FIELD_KEY.ID]) {
      this.propertyDetailViewModel.formPropsData = {
        ...this.propertyDetailViewModel.formPropsData,
        ...Object.keys(PIM_PROPERTY_DETAIL_FIELD_KEY)
          .map((index) => {
            return {
              [PIM_PROPERTY_DETAIL_FIELD_KEY[index]]: result[PIM_PROPERTY_DETAIL_FIELD_KEY[index]],
            };
          })
          .reduce((prev, cur) => ({ ...prev, ...cur })),
      };
      this.formStatus = PAGE_STATUS.READY;
    }
  };

  onGetPropertyListSuccessHandler = (result) => {
    if (result) {
      this.propertyList = result;
    }
    this.formStatus = PAGE_STATUS.READY;
  };

  handleFormPropsData = (key, value) => {
    if (key && value !== null) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(this.propertyDetailViewModel.formPropsData[key], value);
      } else {
        this.propertyDetailViewModel.formPropsData[key] = value;
      }
    }
  };
  handleAliasChange = (value) => {
    this.aliasChange = value;
  };
}

export default PropertyDetailViewModel;
