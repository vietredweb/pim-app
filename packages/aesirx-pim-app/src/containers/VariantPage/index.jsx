import React from 'react';
import { observer } from 'mobx-react';
import { VariantViewModelContextProvider } from './VariantViewModel/VariantViewModelContextProvider';
import ListVariant from './ListVariant';

const VariantPage = observer(
  class VariantPage extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div className="px-3 py-4">
          <VariantViewModelContextProvider>
            <ListVariant />
          </VariantViewModelContextProvider>
        </div>
      );
    }
  }
);

export default VariantPage;
