import React from 'react';
import { observer } from 'mobx-react';
import { PropertyViewModelContextProvider } from './PropertyViewModel/PropertyViewModelContextProvider';
import ListProperty from './ListProperty';

const PropertyPage = observer(
  class PropertyPage extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="px-3 py-4">
          <PropertyViewModelContextProvider>
            <ListProperty />
          </PropertyViewModelContextProvider>
        </div>
      );
    }
  }
);

export default PropertyPage;
