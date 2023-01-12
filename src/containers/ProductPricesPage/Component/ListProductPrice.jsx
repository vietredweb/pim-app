import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { withProductPriceViewModel } from '../ProductPriceViewModel/ProductPriceViewModelContextProvider';
import { Tab, Tabs } from 'react-bootstrap';
import SelectComponent from 'components/Select';
import Spinner from 'components/Spinner';
import Table from 'components/Table';
import '../index.scss';
import ActionsBar from 'components/ActionsBar';
import history from 'routes/history';

const ListProductPrice = observer((props) => {
  const { t } = props;
  let listSelected = [];

  const viewModel = props.viewModel;

  useEffect(() => {
    viewModel.initializeData();
  }, []);

  const selectTabHandler = (value) => {
    viewModel.isLoading();
    if (value != 'default') {
      viewModel.getListByFilter('state', {
        value: value,
        type: 'filter',
      });
    } else {
      viewModel.getListByFilter('state', '');
    }
  };

  const selectShowItemsHandler = (value) => {
    viewModel.isLoading();
    viewModel.getListByFilter('list[limit]', value.value);
  };

  const selectPageHandler = (value) => {
    if (value != viewModel.successResponse.pagination.page) {
      viewModel.isLoading();
      viewModel.getListByFilter(
        'limitstart',
        (value - 1) * viewModel.successResponse.pagination.pageLimit
      );
    }
  };

  const currentSelectHandler = (arr) => {
    listSelected = arr.map((o) => o.cells[1].value);
  };

  const selectBulkActionsHandler = (value) => {
    viewModel.isLoading();
    viewModel.updateStatus(listSelected, value.value);
  };

  const deleteProductPrices = () => {
    viewModel.isLoading();
    viewModel.deleteProductPrices(listSelected);
  };

  const columnsTable = [
    {
      Header: 'Id',
      accessor: 'id',
      width: 60,
      className: 'py-2 opacity-50 border-bottom-1 text-uppercase fw-semi',
      Cell: ({ value }) => {
        return <div className="opacity-80">{value}</div>;
      },
    },
    {
      Header: t('txt_product_name'),
      accessor: 'title',
      width: 150,
      className: 'py-2 opacity-50 border-bottom-1 text-uppercase fw-semi',
      Cell: ({ value, row }) => {
        return (
          <>
            <div className="mb-1">{value}</div>
            <div className="text-green">
              <button
                onClick={() => {
                  history.push(`/prices/edit/${row.cells[1].value}`);
                }}
                className="p-0 border-0 bg-transparent d-inline-block text-green"
              >
                {t('txt_edit')}
              </button>
            </div>
          </>
        );
      },
    },
    {
      Header: t('txt_debtor_group'),
      accessor: 'debtorGroup',
      width: 200,
      className: 'py-2 opacity-50 border-bottom-1 text-uppercase fw-semi',
      Cell: ({ value }) => {
        return <>{value.map((o) => o.title).join(', ')}</>;
      },
    },
    {
      Header: t('txt_price'),
      accessor: 'price',
      width: 200,
      className: 'py-2 opacity-50 border-bottom-1 text-uppercase fw-semi',
      Cell: ({ value }) => {
        return (
          <>{parseInt(value).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</>
        );
      },
    },
    {
      Header: t('txt_last_modified'),
      accessor: 'lastModified',
      width: 150,
      className: 'py-2 opacity-50 border-bottom-1 text-uppercase fw-semi',
      Cell: ({ value }) => {
        return (
          <div className="pe-2">
            <div className="mb-1">
              {
                viewModel?.successResponse?.listPublishStatus.find((o) => o.value == value.status)
                  .label
              }
            </div>
            <div>
              {value.dateTime} by {value.author}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">{t('txt_left_menu_price_management')}</h2>
        <ActionsBar
          buttons={[
            {
              title: t('txt_delete'),
              icon: '/assets/images/delete.svg',
              iconColor: '#cb222c',
              textColor: '#cb222c',
              handle: async () => {
                deleteProductPrices();
              },
            },
            {
              title: t('txt_add_new_prices'),
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                history.push('/prices/add');
              },
            },
          ]}
        />
      </div>

      {viewModel?.successResponse?.listPublishStatus.length > 0 && (
        <>
          <Tabs
            defaultActiveKey={'default'}
            id="tab-setting"
            onSelect={(k) => selectTabHandler(k)}
            className="mb-3"
          >
            <Tab eventKey={'default'} title={t('txt_all_products')} />
            {viewModel?.successResponse?.listPublishStatus.map((o) => (
              <Tab key={o.value} eventKey={o.value} title={o.label} />
            ))}
          </Tabs>

          <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
            <div className="d-flex gap-2">
              <SelectComponent
                options={viewModel?.successResponse?.listPublishStatus}
                className={`fs-sm`}
                isBorder={true}
                placeholder={t('txt_bulk_actions')}
                plColor={`text-color`}
                onChange={(o) => selectBulkActionsHandler(o)}
                arrowColor={'#222328'}
              />
            </div>
            <div className="d-flex align-items-center">
              <div className="opacity-50 me-2">Showing</div>
              <SelectComponent
                defaultValue={{
                  label: `${viewModel?.successResponse?.filters['list[limit]']} items`,
                  value: viewModel?.successResponse?.filters['list[limit]'],
                }}
                options={[...Array(9)].map((o, index) => ({
                  label: `${(index + 1) * 10} items`,
                  value: (index + 1) * 10,
                }))}
                onChange={(o) => selectShowItemsHandler(o)}
                className={`fs-sm`}
                isBorder={true}
                placeholder={`Select`}
                arrowColor={'#222328'}
              />
            </div>
          </div>
        </>
      )}

      {viewModel?.successResponse?.state ? (
        <Table
          classNameTable={`bg-white rounded`}
          columns={columnsTable}
          data={viewModel?.successResponse?.listProductPrice}
          selection={false}
          pagination={viewModel?.successResponse?.pagination}
          selectPage={selectPageHandler}
          currentSelect={currentSelectHandler}
        ></Table>
      ) : (
        <Spinner />
      )}
    </>
  );
});

export default withTranslation('common')(withProductPriceViewModel(ListProductPrice));
