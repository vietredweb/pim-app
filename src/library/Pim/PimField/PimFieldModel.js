/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import BaseItemModel from 'aesirx-dma-lib/src/Abstract/BaseItemModel';
import BaseModel from 'store/Models/Abstract/BaseModel';
import { PIM_FIELD_DETAIL_FIELD_KEY } from '../../Constant/PimConstant';
class FieldModel extends BaseModel {
  constructor(entities) {
    super(entities);
    if (entities) {
      this.items = entities._embedded.item.map((element) => {
        return new FieldItemModel(element);
      });
    }
  }
}
class FieldItemModel extends BaseItemModel {
  id = null;
  name = null;
  published = 0;
  featured = 0;
  custom_fields = null;
  created_user_name = null;
  created_time = null;
  publish_up = null;
  field_group_id = null;
  field_group_name = null;
  type = null;
  fieldcode = null;
  params = null;
  options = null;
  relevance = null;

  constructor(entity) {
    super(entity);
    if (entity) {
      this.id = entity[PIM_FIELD_DETAIL_FIELD_KEY.ID] ?? '';
      this.name = entity[PIM_FIELD_DETAIL_FIELD_KEY.NAME] ?? '';
      this.published = entity[PIM_FIELD_DETAIL_FIELD_KEY.PUBLISHED] ?? 0;
      this.featured = entity[PIM_FIELD_DETAIL_FIELD_KEY.FEATURED]?.toString() ?? '0';
      this.custom_fields = entity[PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS] ?? '';
      this.created_user_name = entity[PIM_FIELD_DETAIL_FIELD_KEY.CREATED_USER_NAME] ?? '';
      this.created_time = entity[PIM_FIELD_DETAIL_FIELD_KEY.CREATED_TIME] ?? '';
      this.publish_up = entity[PIM_FIELD_DETAIL_FIELD_KEY.PUBLISH_UP] ?? '';
      this.field_group_id = entity[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_GROUP_ID] ?? '';
      this.field_group_name = entity[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_GROUP_NAME] ?? '';
      this.type = entity[PIM_FIELD_DETAIL_FIELD_KEY.TYPE] ?? '';
      this.fieldcode = entity[PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE] ?? '';
      this.params = entity[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS][0]
        ? JSON.parse(JSON.parse(entity[PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]))
        : [];
      this.options = entity[PIM_FIELD_DETAIL_FIELD_KEY.OPTIONS] ?? '';
      this.relevance = entity[PIM_FIELD_DETAIL_FIELD_KEY.RELEVANCE] ?? '';
    }
  }

  toObject = () => {
    return {};
  };

  toJSON = () => {
    return {
      ...this.baseToJSON(),
      [PIM_FIELD_DETAIL_FIELD_KEY.ID]: this.id,
      [PIM_FIELD_DETAIL_FIELD_KEY.NAME]: this.name,
      [PIM_FIELD_DETAIL_FIELD_KEY.PUBLISHED]: this.published,
      [PIM_FIELD_DETAIL_FIELD_KEY.FEATURED]: this.featured,
      [PIM_FIELD_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: this.custom_fields,
      [PIM_FIELD_DETAIL_FIELD_KEY.CREATED_USER_NAME]: this.created_user_name,
      [PIM_FIELD_DETAIL_FIELD_KEY.PUBLISH_UP]: this.publish_up,
      [PIM_FIELD_DETAIL_FIELD_KEY.FIELD_GROUP_ID]: this.field_group_id,
      [PIM_FIELD_DETAIL_FIELD_KEY.FIELD_GROUP_NAME]: this.field_group_name,
      [PIM_FIELD_DETAIL_FIELD_KEY.TYPE]: this.type,
      [PIM_FIELD_DETAIL_FIELD_KEY.FIELD_CODE]: this.fieldcode,
      // [PIM_FIELD_DETAIL_FIELD_KEY.PARAMS]: this.params,
      [PIM_FIELD_DETAIL_FIELD_KEY.OPTIONS]: this.options,
      [PIM_FIELD_DETAIL_FIELD_KEY.RELEVANCE]: this.relevance,
    };
  };

  static __transformItemToApiOfCreation = (data) => {
    let formData = new FormData();
    const excluded = [PIM_FIELD_DETAIL_FIELD_KEY.ID];
    Object.keys(PIM_FIELD_DETAIL_FIELD_KEY).forEach((index) => {
      if (!excluded.includes(index) && data[PIM_FIELD_DETAIL_FIELD_KEY[index]]) {
        formData.append(
          [PIM_FIELD_DETAIL_FIELD_KEY[index]],
          data[PIM_FIELD_DETAIL_FIELD_KEY[index]]
        );
      }
    });
    formData.append([PIM_FIELD_DETAIL_FIELD_KEY.ID], data[PIM_FIELD_DETAIL_FIELD_KEY.ID] ?? 0);
    return formData;
  };

  static __transformItemToApiOfUpdation = (data) => {
    let formData = {};
    const excluded = [];
    Object.keys(PIM_FIELD_DETAIL_FIELD_KEY).forEach((index) => {
      if (!excluded.includes(index) && data[PIM_FIELD_DETAIL_FIELD_KEY[index]]) {
        formData[PIM_FIELD_DETAIL_FIELD_KEY[index]] = data[PIM_FIELD_DETAIL_FIELD_KEY[index]];
      }
    });
    return formData;
  };
}

export { FieldItemModel, FieldModel };