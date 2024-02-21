import { PIM_PROPERTY_DETAIL_FIELD_KEY, PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY } from 'aesirx-lib';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { FORM_FIELD_TYPE, Spinner, renderingGroupFieldHandler } from 'aesirx-uikit';
import { PropertyValueViewModelContext } from 'containers/PropertyValuePage/PropertyValueViewModel/PropertyValueViewModelContextProvider';
import { Row } from 'react-bootstrap';
import { PropertyStore } from 'containers/PropertyPage/store';
import PropertyViewModel from 'containers/PropertyPage/PropertyViewModel/PropertyViewModel';

const propertyStore = new PropertyStore();
const propertyViewModel = new PropertyViewModel(propertyStore);

const PropertyValueInformation = observer(
  class PropertyValueInformation extends Component {
    static contextType = PropertyValueViewModelContext;

    constructor(props) {
      super(props);
      this.propertyListViewModel = propertyViewModel.propertyListViewModel;
      this.state = { country: null };
      this.validator = this.props.validator;
    }

    componentDidMount() {
      const fetchData = async () => {
        await this.propertyListViewModel.initializeAllData();
      };
      fetchData();
    }

    render() {
      this.viewModel = this.context.model.propertyValueDetailViewModel;

      const { t, validator } = this.props;

      const generateFormSetting = [
        {
          fields: [
            {
              label: t('txt_property'),
              key: PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.TITLE,
              type: FORM_FIELD_TYPE.SELECTION,
              getValueSelected: this.viewModel.propertyValueDetailViewModel.formPropsData[
                PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.CUSTOM_FIELDS
              ]['property']
                ? {
                    label:
                      this.viewModel.propertyValueDetailViewModel.formPropsData[
                        PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.CUSTOM_FIELDS
                      ]['property'],
                    value:
                      this.viewModel.propertyValueDetailViewModel.formPropsData[
                        PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.CUSTOM_FIELDS
                      ]['property'],
                  }
                : null,
              getDataSelectOptions: this.propertyListViewModel?.successResponse
                ?.listPropertysWithoutPagination?.length
                ? this.propertyListViewModel?.successResponse?.listPropertysWithoutPagination?.map(
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
                  this.viewModel.handleFormPropsData(
                    [PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.CUSTOM_FIELDS],
                    { ['property']: [data?.value] }
                  );
                }
                this.setState((prevState) => {
                  return {
                    ...prevState,
                  };
                });
              },
              required: true,
              validation: 'required',
              placeholder: t('txt_select_property'),
              className: 'col-lg-12',
            },
          ],
        },
      ];
      return (
        <>
          {!this.propertyListViewModel?.successResponse?.state && (
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
export default withTranslation()(PropertyValueInformation);
