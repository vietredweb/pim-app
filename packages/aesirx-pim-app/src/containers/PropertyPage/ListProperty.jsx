import { Table, AesirXSelect, Spinner, notify, ActionsBar } from 'aesirx-uikit';
import React, { useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { useTranslation, withTranslation } from 'react-i18next';
import { observer } from 'mobx-react';
import { withPropertyViewModel } from './PropertyViewModel/PropertyViewModelContextProvider';
import { historyPush } from 'routes/routes';

const ListProperty = observer((props) => {
  const { t } = useTranslation();
  let listSelected = [];
  const viewModel = props.model.propertyListViewModel;
  useEffect(() => {
    viewModel.initializeData();
  }, []);
  const columnsTable = [
    {
      Header: t('txt_title'),
      accessor: 'property',
      width: 300,
      className: 'py-18 text-gray border-bottom-1 text-uppercase fw-semibold align-middle',
      Cell: ({ value }) => {
        return (
          <>
            <div className="py-8px">{value?.title}</div>
            <div className="text-green">
              <button
                onClick={() => {
                  historyPush(`/property/edit/${value.id}`);
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
  ];

  const currentSelectHandler = (arr) => {
    listSelected = arr.map((o) => o.cells[1]?.value?.id);
  };

  const deletePropertys = () => {
    if (listSelected.length < 1) {
      notify(t('txt_row_select_error'), 'error');
    } else {
      viewModel.isLoading();
      viewModel.deletePropertys(listSelected);
    }
  };

  const selectPageHandler = (value) => {
    if (value != viewModel.successResponse.pagination.page) {
      viewModel.isLoading();
      viewModel.getListByFilter(
        'list[start]',
        (value - 1) * viewModel.successResponse.pagination.pageLimit
      );
    }
  };

  const selectShowItemsHandler = (value) => {
    viewModel.isLoading();
    viewModel.getListByFilter('list[limit]', value?.value);
  };

  const selectTabHandler = (value) => {
    viewModel.isLoading();
    if (value != 'default') {
      viewModel.getListByFilter('filter[published]', value);
    } else {
      viewModel.getListByFilter('filter[published]', '');
    }
  };

  return (
    <div className="px-3 py-4">
      <div className="mb-3 d-flex align-items-center justify-content-between">
        <h2>{t('txt_left_menu_property')}</h2>

        <ActionsBar
          buttons={[
            {
              title: t('txt_delete'),
              icon: '/assets/images/delete.svg',
              iconColor: '#cb222c',
              textColor: '#cb222c',
              handle: async () => {
                deletePropertys();
              },
            },
            {
              title: t('txt_add_new'),
              icon: '/assets/images/plus.svg',
              variant: 'success',
              handle: async () => {
                historyPush('/property/add');
              },
            },
          ]}
        />
      </div>
      <div className="mb-3">
        <Tabs
          defaultActiveKey={viewModel?.successResponse?.filters['filter[published]'] ?? 'default'}
          id="tab-setting"
          onSelect={(k) => selectTabHandler(k)}
        >
          <Tab eventKey="default" title={t('txt_all_property')} />
        </Tabs>
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2 my-20">
        <div></div>
        <div className="d-flex align-items-center">
          <div className="text-gray me-2">{t('txt_showing')}</div>
          <AesirXSelect
            defaultValue={{
              label: `${viewModel?.successResponse?.filters['list[limit]']} ${t('txt_items')}`,
              value: viewModel?.successResponse?.filters['list[limit]'],
            }}
            options={[...Array(9)].map((o, index) => ({
              label: `${(index + 1) * 10} ${t('txt_items')}`,
              value: (index + 1) * 10,
            }))}
            onChange={(o) => selectShowItemsHandler(o)}
            className={`fs-sm bg-white shadow-sm rounded-2`}
            isBorder={true}
            placeholder={`Select`}
            arrowColor={'var(--dropdown-indicator-color)'}
            size="large"
          />
        </div>
      </div>
      <div className="bg-white rounded">
        {viewModel?.successResponse?.state ? (
          <Table
            canSort={true}
            sortAPI={false}
            classNameTable={`bg-white rounded table-striped table`}
            columns={columnsTable}
            data={viewModel?.successResponse?.listPropertys}
            pagination={viewModel?.successResponse?.pagination}
            selection={false}
            selectPage={selectPageHandler}
            currentSelect={currentSelectHandler}
          ></Table>
        ) : (
          <Spinner />
        )}
      </div>
    </div>
  );
});

export default withTranslation()(withPropertyViewModel(ListProperty));
