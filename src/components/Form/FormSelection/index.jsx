/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import React, { Component } from 'react';

import SelectComponent from '../../../components/Select';
import CreatableComponent from '../../../components/Select/Creatable';
import './index.scss';

class FormSelection extends Component {
  constructor(props) {
    super(props);

    this.field = this.props.field;
  }

  render() {
    return (
      <>
        {this.field.creatable ? (
          <CreatableComponent
            defaultValue={this.field.getValueSelected}
            isBorder={true}
            arrowColor={this.field.arrowColor}
            placeholder={this.field.placeholder}
            className="fs-14"
          />
        ) : (
          <SelectComponent
            defaultValue={this.field.getValueSelected}
            options={this.field.getDataSelectOptions}
            className="fs-14"
            isBorder={true}
            //onFocus={this.field.changed}
            onBlur={this.field.blurred}
            isMulti={this.field.isMulti}
            onChange={this.field.handleChange}
            arrowColor={this.field.arrowColor}
            placeholder={this.field.placeholder}
          />
        )}
      </>
    );
  }
}

export default FormSelection;
