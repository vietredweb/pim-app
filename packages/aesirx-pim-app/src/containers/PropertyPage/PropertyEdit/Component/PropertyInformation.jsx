import { PIM_PROPERTY_DETAIL_FIELD_KEY } from 'aesirx-lib';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { FORM_FIELD_TYPE, Spinner, renderingGroupFieldHandler } from 'aesirx-uikit';
import { PropertyViewModelContext } from 'containers/PropertyPage/PropertyViewModel/PropertyViewModelContextProvider';
import { CountryStore } from 'containers/CountryPage/store';
import CountryViewModel from 'containers/CountryPage/CountryViewModel/CountryViewModel';
import { StateStore } from 'containers/StatePage/store';
import StateViewModel from 'containers/StatePage/StateViewModel/StateViewModel';
import { CityStore } from 'containers/CityPage/store';
import CityViewModel from 'containers/CityPage/CityViewModel/CityViewModel';
import { Row } from 'react-bootstrap';

const countryStore = new CountryStore();
const countryViewModel = new CountryViewModel(countryStore);
const stateStore = new StateStore();
const stateViewModel = new StateViewModel(stateStore);
const cityStore = new CityStore();
const cityViewModel = new CityViewModel(cityStore);

const PropertyInformation = observer(
  class PropertyInformation extends Component {
    static contextType = PropertyViewModelContext;

    constructor(props) {
      super(props);
      this.countryListViewModel = countryViewModel.countryListViewModel;
      this.stateListViewModel = stateViewModel.stateListViewModel;
      this.cityListViewModel = cityViewModel.cityListViewModel;
      this.state = { country: null };
      this.validator = this.props.validator;
    }

    componentDidMount() {
      const fetchData = async () => {
        await this.countryListViewModel.initializeAllData();
      };
      fetchData();
    }

    render() {
      this.viewModel = this.context.model.propertyDetailViewModel;

      const { t, validator } = this.props;

      const generateFormSetting = [
        {
          fields: [],
        },
      ];
      return (
        <>
          {(!this.countryListViewModel?.successResponse?.state ||
            (this.state.country && !this.stateListViewModel?.successResponse?.state) ||
            (this.state.state && !this.cityListViewModel?.successResponse?.state)) && (
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
export default withTranslation()(PropertyInformation);
