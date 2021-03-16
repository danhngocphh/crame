const { ActionResponse, APIError } = require('../../helpers');
const { saveDB } = require('../../infrastructure/services');
const _ = require('lodash');
const config = require('../../config');
const { rootCategoryService } = require('../../infrastructure/services');

const rootCategoryController = {
  setList: async (req, res) => {
    const {
      $add, $remove, $update, $delete
    } = req.body.items;

    const { id } = req.user;
    const listPromiseAll = [];
    if ($add && $add.length) {
      $add.forEach((item) => listPromiseAll.push(rootCategoryService.add({ ...item, createdBy: id, updatedBy: id }).then((res) => ({ ...res, kind: 'add' }))));
    }

    if ($update && $update.length) {
      $update.forEach((item) => listPromiseAll.push(rootCategoryService.update({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'update' }))));
    }

    if ($remove && $remove.length) {
      $remove.forEach((item) => listPromiseAll.push(rootCategoryService.remove({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'remove' }))));
    }

    if ($delete && $delete.length) {
      $delete.forEach((item) => listPromiseAll.push(rootCategoryService.deleteItem({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'delete' }))));
    }

    const resLst = await Promise.all(listPromiseAll);
    return res.status(HttpStatus.OK).json({
      status: true,
      items: {
        $rltAdd: resLst.filter(({ kind }) => kind === 'add'),
        $rltUpdate: resLst.filter(({ kind }) => kind === 'update'),
        $rltRemove: resLst.filter(({ kind }) => kind === 'remove'),
        $rltDelete: resLst.filter(({ kind }) => kind === 'delete')
      }
    });
  },
  get: async (req, res, next) => {
    try {
      const { body: dataReq } = req;
      const category = dataReq.data;
      const { id } = req.user;
      if (category && category.length ) {
        const data = rootCategoryService.get({ ...category, createdBy: id, updatedBy: id })
        res.status(HttpStatus.OK).json({
          status: true,
          items: data
        });
      } else {
        throw new APIError(config.crawler.errAddCategory, config.httpStatus.BadRequest, {
          data: config.crawler.errAddCategory,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addChild: async (req, res, next) => {
    try {
      const { body: dataReq } = req;
      const category = dataReq.data;
      const { id } = req.user;
      if (category && category.length ) {
        const data = rootCategoryService.addChild({ ...category, createdBy: id, updatedBy: id });
        res.status(HttpStatus.OK).json({
          status: true,
          items: data
        });
      } else {
        throw new APIError(config.crawler.errAddCategory, config.httpStatus.BadRequest, {
          data: config.crawler.errAddCategory,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  deleteChild: async (req, res, next) => {
    try {
      const actionResponse = new ActionResponse(res);
      const { body: dataReq } = req;
      if (dataReq.idRootCategory && dataReq.idChildCategory ) {
        const data = rootCategoryService.deleteChild({dataReq})
        res.status(HttpStatus.OK).json({
          status: true,
          items: data
        });
      } else {
        throw new APIError(config.crawler.errAddCategory, config.httpStatus.BadRequest, {
          data: config.crawler.errAddCategory,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = rootCategoryController;
