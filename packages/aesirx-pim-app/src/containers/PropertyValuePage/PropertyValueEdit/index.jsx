/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY } from 'aesirx-lib';
import SimpleReactValidator from 'simple-react-validator';
import _ from 'lodash';
import { withPropertyValueViewModel } from '../PropertyValueViewModel/PropertyValueViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, PublishOptions, ActionsBar, Input } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';
import PropertyValueInformation from './Component/PropertyValueInformation';

const EditPropertyValue = observer(
  class EditPropertyValue extends Component {
    propertyValueDetailViewModel = null;
    formPropsData = { [PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: {} };
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });
      this.propertyValueDetailViewModel = props.model?.propertyValueDetailViewModel
        ? props.model?.propertyValueDetailViewModel
        : null;

      this.propertyValueDetailViewModel.setForm(this);
      this.isEdit = props.match.params?.id ? true : false;
    }

    async componentDidMount() {
      const { match } = this.props;
      if (this.isEdit) {
        this.formPropsData[PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.ID] = match.params?.id;
        await this.propertyValueDetailViewModel.initializeData();
      }
    }

    handleValidateForm() {
      this.validator.showMessages();
    }

    debouncedChangeHandler = _.debounce((value) => {
      this.propertyValueDetailViewModel.handleAliasChange(value);
    }, 300);

    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console
      console.log(
        'rerender PropertyValue',
        this.propertyValueDetailViewModel.propertyValueDetailViewModel.formPropsData
      );

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.propertyValueDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={t('txt_property_value')}
              isEdit={this.isEdit}
              redirectUrl={'/property-value'}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async () => {
                      historyPush(`/property-value`);
                    },
                    icon: '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async () => {
                      if (this.validator.allValid()) {
                        const result = this.isEdit
                          ? await this.propertyValueDetailViewModel.update()
                          : await this.propertyValueDetailViewModel.create();
                        if (result !== 0) {
                          historyPush(`/property-value/all`);
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                  },
                  {
                    title: t('txt_save'),
                    validator: this.validator,
                    handle: async () => {
                      if (this.validator.allValid()) {
                        if (this.isEdit) {
                          await this.propertyValueDetailViewModel.update();
                          await this.propertyValueDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.propertyValueDetailViewModel.create();
                          if (!result?.error) {
                            historyPush(`/property-value/edit/${result?.response}`);
                          }
                        }
                      } else {
                        this.handleValidateForm();
                      }
                    },
                    icon: '/assets/images/save.svg',
                    variant: 'success',
                  },
                ]}
              />
            </div>
          </div>
          <Form>
            <Row className="gx-24 mb-24">
              <Col lg={9}>
                <Form.Group className={`mb-24`}>
                  <Input
                    field={{
                      getValueSelected:
                        this.propertyValueDetailViewModel.propertyValueDetailViewModel
                          .formPropsData[PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.TITLE],
                      classNameInput: 'py-10 fs-4',
                      placeholder: t('txt_add_property_value_name'),
                      handleChange: (event) => {
                        this.propertyValueDetailViewModel.handleFormPropsData(
                          PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.TITLE,
                          event.target.value
                        );
                      },
                      required: true,
                      validation: 'required',
                      blurred: () => {
                        this.validator.showMessageFor(t('txt_property_value_name'));
                      },
                    }}
                  />
                  {this.validator.message(
                    t('txt_property_value_name'),
                    this.propertyValueDetailViewModel.propertyValueDetailViewModel.formPropsData[
                      PIM_PROPERTY_VALUE_DETAIL_FIELD_KEY.TITLE
                    ],
                    'required',
                    {
                      className: 'text-danger mt-8px',
                    }
                  )}
                </Form.Group>
                <PropertyValueInformation
                  validator={this.validator}
                  messagesShown={this.validator.messagesShown}
                  isEdit={this.isEdit}
                  formPropsData={
                    this.propertyValueDetailViewModel?.propertyValueDetailViewModel.formPropsData
                  }
                  {...this.props}
                />
              </Col>
              <Col lg={3}>
                <PublishOptions
                  detailViewModal={this.propertyValueDetailViewModel}
                  formPropsData={
                    this.propertyValueDetailViewModel.propertyValueDetailViewModel.formPropsData
                  }
                  isEdit={this.isEdit}
                  isFeatured={false}
                  isPublished={false}
                />
              </Col>
            </Row>
          </Form>
        </div>
      );
    }
  }
);

export default withTranslation()(withRouter(withPropertyValueViewModel(EditPropertyValue)));
