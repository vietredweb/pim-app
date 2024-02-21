import React from 'react';
import { observer } from 'mobx-react';
import { PropertyValueViewModelContextProvider } from './PropertyValueViewModel/PropertyValueViewModelContextProvider';
import ListPropertyValue from './ListPropertyValue';

const PropertyValuePage = observer(
  class PropertyValuePage extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="px-3 py-4">
          <PropertyValueViewModelContextProvider>
            <ListPropertyValue />
          </PropertyValueViewModelContextProvider>
        </div>
      );
    }
  }
);

export default PropertyValuePage;
