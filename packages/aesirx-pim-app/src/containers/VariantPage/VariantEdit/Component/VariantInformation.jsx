import { PIM_VARIANT_DETAIL_FIELD_KEY } from 'aesirx-lib';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { FORM_FIELD_TYPE, Spinner, renderingGroupFieldHandler } from 'aesirx-uikit';
import { VariantViewModelContext } from 'containers/VariantPage/VariantViewModel/VariantViewModelContextProvider';
import { Row } from 'react-bootstrap';
import { PropertyValueStore } from 'containers/PropertyValuePage/store';
import PropertyValueViewModel from 'containers/PropertyValuePage/PropertyValueViewModel/PropertyValueViewModel';

const propertyValueStore = new PropertyValueStore();
const propertyValueViewModel = new PropertyValueViewModel(propertyValueStore);

const VariantInformation = observer(
  class VariantInformation extends Component {
    static contextType = VariantViewModelContext;

    constructor(props) {
      super(props);
      this.propertyValueListViewModel = propertyValueViewModel.propertyValueListViewModel;
      this.state = { country: null };
      this.validator = this.props.validator;
    }

    componentDidMount() {
      const fetchData = async () => {
        await this.propertyValueListViewModel.initializeAllData();
      };
      fetchData();
    }

    render() {
      this.viewModel = this.context.model.variantDetailViewModel;

      const { t, validator } = this.props;

      const generateFormSetting = [
        {
          fields: [
            {
              label: t('txt_property_value'),
              key: PIM_VARIANT_DETAIL_FIELD_KEY.TITLE,
              type: FORM_FIELD_TYPE.SELECTION,
              getValueSelected: this.viewModel.variantDetailViewModel.formPropsData[
                PIM_VARIANT_DETAIL_FIELD_KEY.CUSTOM_FIELDS
              ]['property_value']
                ? {
                    label:
                      this.viewModel.variantDetailViewModel.formPropsData[
                        PIM_VARIANT_DETAIL_FIELD_KEY.CUSTOM_FIELDS
                      ]['property_value'],
                    value:
                      this.viewModel.variantDetailViewModel.formPropsData[
                        PIM_VARIANT_DETAIL_FIELD_KEY.CUSTOM_FIELDS
                      ]['property_value'],
                  }
                : null,
              getDataSelectOptions: this.propertyValueListViewModel?.successResponse
                ?.listPropertyValuesWithoutPagination?.length
                ? this.propertyValueListViewModel?.successResponse?.listPropertyValuesWithoutPagination?.map(
                    (item) => {
                      return {
                        label: item?.label,
                        value: item?.value,
                      };
                    }
                  )
                : [],
              handleChange: async (data) => {
                if (data) {
                  this.viewModel.handleFormPropsData([PIM_VARIANT_DETAIL_FIELD_KEY.CUSTOM_FIELDS], {
                    ['property_value']: [data?.value],
                  });
                }
                this.setState((prevState) => {
                  return {
                    ...prevState,
                  };
                });
              },
              required: true,
              validation: 'required',
              placeholder: t('txt_select_property_value'),
              className: 'col-lg-12',
            },
          ],
        },
      ];
      return (
        <>
          {!this.propertyValueListViewModel?.successResponse?.state && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="p-24 bg-white rounded-1 shadow-sm h-100 mt-24">
            <Row>
              {Object.keys(generateFormSetting)
                .map((groupIndex) => {
                  return [...Array(generateFormSetting[groupIndex])].map((group) => {
                    return renderingGroupFieldHandler(group, validator);
                  });
                })
                .reduce((arr, el) => {
                  return arr.concat(el);
                }, [])}
            </Row>
          </div>
        </>
      );
    }
  }
);
export default withTranslation()(VariantInformation);
