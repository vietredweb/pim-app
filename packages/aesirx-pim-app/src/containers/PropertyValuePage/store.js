import { PropertyValueApiService, PropertyValueItemModel } from 'aesirx-lib';

class PropertyValueStore {
  async getList(filters) {
    try {
      const getListAPIService = new PropertyValueApiService();
      const respondedData = await getListAPIService.getList(filters);
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async getListWithoutPagination() {
    try {
      const getListAPIService = new PropertyValueApiService();
      const respondedData = await getListAPIService.getList({ 'list[limit]': 9999 });

      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async getDetail(id) {
    if (!id) return { error: false, response: false };

    try {
      const results = true;

      if (results) {
        const getDetailInfoAPIService = new PropertyValueApiService();

        const respondedData = await getDetailInfoAPIService.getDetail(id);

        return { error: false, response: respondedData };
      }
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async create(createFieldData) {
    try {
      console.log('createFieldData', createFieldData);
      const convertedUpdateGeneralData =
        PropertyValueItemModel.__transformItemToApiOfCreation(createFieldData);
      let resultOnSave;
      const createOrganizationApiService = new PropertyValueApiService();

      // eslint-disable-next-line prefer-const
      resultOnSave = await createOrganizationApiService.create(convertedUpdateGeneralData);
      if (resultOnSave?.result) {
        return { error: false, response: resultOnSave?.result };
      } else {
        return { error: true, response: resultOnSave };
      }
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async update(updateFieldData) {
    try {
      const convertedUpdateGeneralData =
        PropertyValueItemModel.__transformItemToApiOfUpdation(updateFieldData);

      let resultOnSave;
      const updateOrganizationApiService = new PropertyValueApiService();
      // eslint-disable-next-line prefer-const
      resultOnSave = await updateOrganizationApiService.update(convertedUpdateGeneralData);
      return { error: false, response: resultOnSave?.result };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }

  async delete(arr) {
    try {
      const aesirxOrganizationApiService = new PropertyValueApiService();
      const respondedData = await aesirxOrganizationApiService.delete(arr);
      return { error: false, response: respondedData };
    } catch (error) {
      return { error: true, response: error?.response?.data };
    }
  }
}

export { PropertyValueStore };
