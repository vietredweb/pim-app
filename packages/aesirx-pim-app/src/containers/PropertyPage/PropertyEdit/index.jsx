/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { PIM_PROPERTY_DETAIL_FIELD_KEY } from 'aesirx-lib';
import SimpleReactValidator from 'simple-react-validator';
import _ from 'lodash';
import { withPropertyViewModel } from '../PropertyViewModel/PropertyViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, PublishOptions, ActionsBar, Input } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';
import PropertyInformation from './Component/PropertyInformation';

const EditProperty = observer(
  class EditProperty extends Component {
    propertyDetailViewModel = null;
    formPropsData = {};
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });
      this.propertyDetailViewModel = props.model?.propertyDetailViewModel
        ? props.model?.propertyDetailViewModel
        : null;

      this.propertyDetailViewModel.setForm(this);
      this.isEdit = props.match.params?.id ? true : false;
    }

    async componentDidMount() {
      const { match } = this.props;
      if (this.isEdit) {
        this.formPropsData[PIM_PROPERTY_DETAIL_FIELD_KEY.ID] = match.params?.id;
        await this.propertyDetailViewModel.initializeData();
      }
    }

    handleValidateForm() {
      this.validator.showMessages();
    }

    debouncedChangeHandler = _.debounce((value) => {
      this.propertyDetailViewModel.handleAliasChange(value);
    }, 300);

    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console
      console.log(
        'rerender Property',
        this.propertyDetailViewModel.propertyDetailViewModel.formPropsData
      );

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.propertyDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={t('txt_property')}
              isEdit={this.isEdit}
              redirectUrl={'/property'}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async () => {
                      historyPush(`/property`);
                    },
                    icon: '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async () => {
                      if (this.validator.allValid()) {
                        const result = this.isEdit
                          ? await this.propertyDetailViewModel.update()
                          : await this.propertyDetailViewModel.create();
                        if (result !== 0) {
                          historyPush(`/property/all`);
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
                          await this.propertyDetailViewModel.update();
                          await this.propertyDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.propertyDetailViewModel.create();
                          if (!result?.error) {
                            historyPush(`/property/edit/${result?.response}`);
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
                        this.propertyDetailViewModel.propertyDetailViewModel.formPropsData[
                          PIM_PROPERTY_DETAIL_FIELD_KEY.TITLE
                        ],
                      classNameInput: 'py-10 fs-4',
                      placeholder: t('txt_add_property_name'),
                      handleChange: (event) => {
                        this.propertyDetailViewModel.handleFormPropsData(
                          PIM_PROPERTY_DETAIL_FIELD_KEY.TITLE,
                          event.target.value
                        );
                      },
                      required: true,
                      validation: 'required',
                      blurred: () => {
                        this.validator.showMessageFor(t('txt_property_name'));
                      },
                    }}
                  />
                  {this.validator.message(
                    t('txt_property_name'),
                    this.propertyDetailViewModel.propertyDetailViewModel.formPropsData[
                      PIM_PROPERTY_DETAIL_FIELD_KEY.TITLE
                    ],
                    'required',
                    {
                      className: 'text-danger mt-8px',
                    }
                  )}
                </Form.Group>
                <PropertyInformation
                  validator={this.validator}
                  messagesShown={this.validator.messagesShown}
                  isEdit={this.isEdit}
                  formPropsData={
                    this.propertyDetailViewModel?.propertyDetailViewModel.formPropsData
                  }
                  {...this.props}
                />
              </Col>
              <Col lg={3}>
                <PublishOptions
                  detailViewModal={this.propertyDetailViewModel}
                  formPropsData={this.propertyDetailViewModel.propertyDetailViewModel.formPropsData}
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

export default withTranslation()(withRouter(withPropertyViewModel(EditProperty)));
