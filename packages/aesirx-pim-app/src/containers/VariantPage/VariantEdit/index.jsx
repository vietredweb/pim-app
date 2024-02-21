/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Row } from 'react-bootstrap';
import { PIM_VARIANT_DETAIL_FIELD_KEY } from 'aesirx-lib';
import SimpleReactValidator from 'simple-react-validator';
import _ from 'lodash';
import { withVariantViewModel } from '../VariantViewModel/VariantViewModelContextProvider';
import EditHeader from 'components/EditHeader';
import { PAGE_STATUS, Spinner, PublishOptions, ActionsBar, Input } from 'aesirx-uikit';
import { historyPush } from 'routes/routes';
import VariantInformation from './Component/VariantInformation';

const EditVariant = observer(
  class EditVariant extends Component {
    variantDetailViewModel = null;
    formPropsData = { [PIM_VARIANT_DETAIL_FIELD_KEY.CUSTOM_FIELDS]: {} };
    isEdit = false;
    constructor(props) {
      super(props);
      this.state = {};
      this.validator = new SimpleReactValidator({ autoForceUpdate: this });
      this.variantDetailViewModel = props.model?.variantDetailViewModel
        ? props.model?.variantDetailViewModel
        : null;

      this.variantDetailViewModel.setForm(this);
      this.isEdit = props.match.params?.id ? true : false;
    }

    async componentDidMount() {
      const { match } = this.props;
      if (this.isEdit) {
        this.formPropsData[PIM_VARIANT_DETAIL_FIELD_KEY.ID] = match.params?.id;
        await this.variantDetailViewModel.initializeData();
      }
    }

    handleValidateForm() {
      this.validator.showMessages();
    }

    debouncedChangeHandler = _.debounce((value) => {
      this.variantDetailViewModel.handleAliasChange(value);
    }, 300);

    render() {
      const { t } = this.props;
      // eslint-disable-next-line no-console
      console.log(
        'rerender Variant',
        this.variantDetailViewModel.variantDetailViewModel.formPropsData
      );

      return (
        <div className="py-4 px-3 h-100 d-flex flex-column">
          {this.variantDetailViewModel.formStatus === PAGE_STATUS.LOADING && (
            <Spinner className="spinner-overlay" />
          )}
          <div className="d-flex align-items-center justify-content-between mb-24 flex-wrap">
            <EditHeader
              props={this.props}
              title={t('txt_variant')}
              isEdit={this.isEdit}
              redirectUrl={'/variant'}
            />
            <div className="position-relative">
              <ActionsBar
                buttons={[
                  {
                    title: t('txt_cancel'),
                    handle: async () => {
                      historyPush(`/variant`);
                    },
                    icon: '/assets/images/cancel.svg',
                  },
                  {
                    title: t('txt_save_close'),
                    handle: async () => {
                      if (this.validator.allValid()) {
                        const result = this.isEdit
                          ? await this.variantDetailViewModel.update()
                          : await this.variantDetailViewModel.create();
                        if (result !== 0) {
                          historyPush(`/variant/all`);
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
                          await this.variantDetailViewModel.update();
                          await this.variantDetailViewModel.initializeData();
                          this.forceUpdate();
                        } else {
                          const result = await this.variantDetailViewModel.create();
                          if (!result?.error) {
                            historyPush(`/variant/edit/${result?.response}`);
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
                        this.variantDetailViewModel.variantDetailViewModel.formPropsData[
                          PIM_VARIANT_DETAIL_FIELD_KEY.TITLE
                        ],
                      classNameInput: 'py-10 fs-4',
                      placeholder: t('txt_add_variant_name'),
                      handleChange: (event) => {
                        this.variantDetailViewModel.handleFormPropsData(
                          PIM_VARIANT_DETAIL_FIELD_KEY.TITLE,
                          event.target.value
                        );
                      },
                      required: true,
                      validation: 'required',
                      blurred: () => {
                        this.validator.showMessageFor(t('txt_variant_name'));
                      },
                    }}
                  />
                  {this.validator.message(
                    t('txt_variant_name'),
                    this.variantDetailViewModel.variantDetailViewModel.formPropsData[
                      PIM_VARIANT_DETAIL_FIELD_KEY.TITLE
                    ],
                    'required',
                    {
                      className: 'text-danger mt-8px',
                    }
                  )}
                </Form.Group>
                <VariantInformation
                  validator={this.validator}
                  messagesShown={this.validator.messagesShown}
                  isEdit={this.isEdit}
                  formPropsData={this.variantDetailViewModel?.variantDetailViewModel.formPropsData}
                  {...this.props}
                />
              </Col>
              <Col lg={3}>
                <PublishOptions
                  detailViewModal={this.variantDetailViewModel}
                  formPropsData={this.variantDetailViewModel.variantDetailViewModel.formPropsData}
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

export default withTranslation()(withRouter(withVariantViewModel(EditVariant)));
