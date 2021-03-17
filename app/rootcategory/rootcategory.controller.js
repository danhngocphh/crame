const { ActionResponse, APIError } = require('../../helpers');
const _ = require('lodash');
const config = require('../../config');
const { rootCategoryService } = require('./rootcategory.services');

const rootCategoryController = {
  setList: async (req, res) => {
    const {
      $add, $addChild, $remove, $update, $delete, $deleteChild
    } = req.body.items;
    // get id user
    const { id } = req.user;
    const listPromiseAll = [];
    if ($add && $add.length) {
      $add.forEach((item) => listPromiseAll.push(rootCategoryService.add({ ...item, createdBy: id, updatedBy: id }).then((res) => ({ ...res, kind: 'add' }))));
    }
    if ($addChild && $addChild.length) {
      $addChild.forEach((item) => listPromiseAll.push(rootCategoryService.addChild({ ...item, createdBy: id, updatedBy: id }).then((res) => ({ ...res, kind: 'addChild' }))));
    }
    if ($update && $update.length) {
      $update.forEach((item) => listPromiseAll.push(rootCategoryService.update({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'update' }))));
    }

    if ($remove && $remove.length) {
      $remove.forEach((item) => listPromiseAll.push(rootCategoryService.remove({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'remove' }))));
    }
    if ($deleteChild && $deleteChild.length) {
      $deleteChild.forEach((item) => listPromiseAll.push(rootCategoryService.deleteChild({ ...item }).then((res) => ({ ...res, kind: 'deleteChild' }))));
    }

    if ($delete && $delete.length) {
      $delete.forEach((item) => listPromiseAll.push(rootCategoryService.deleteItem({ ...item, updatedBy: id }).then((res) => ({ ...res, kind: 'delete' }))));
    }

    const resLst = await Promise.all(listPromiseAll);
    return res.status(HttpStatus.OK).json({
      status: true,
      items: {
        $rltAdd: resLst.filter(({ kind }) => kind === 'add'),
        $rltAddChild: resLst.filter(({ kind }) => kind === 'addChild'),
        $rltUpdate: resLst.filter(({ kind }) => kind === 'update'),
        $rltRemove: resLst.filter(({ kind }) => kind === 'remove'),
        $rltDeleteChild: resLst.filter(({ kind }) => kind === 'deleteChild'),
        $rltDelete: resLst.filter(({ kind }) => kind === 'delete')
      }
    });
  },
  getList: async (req, res) => {
    const {
      $get, $getListRoot, $getListParent, $getListChild
    } = req.body.items;
    // get id user
    const { id } = req.user;
    const listPromiseAll = [];
    if ($get && $get.length) {
      $get.forEach((item) => listPromiseAll.push(rootCategoryService.get(item).then((res) => ({ ...res, kind: 'get' }))));
    }

    if ($getListRoot && $getListRoot.length) {
      listPromiseAll.push(rootCategoryService.getListRoot().then((res) => ({ ...res, kind: 'getListRoot' })));
    }

    if ($getListParent && $getListParent.length) {
      $getListParent.forEach((item) => listPromiseAll.push(rootCategoryService.getListParent(item).then((res) => ({ ...res, kind: 'getListParent' }))));
    }

    if ($getListChild && $getListChild.length) {
      $getListChild.forEach((item) => listPromiseAll.push(rootCategoryService.getListChild(item).then((res) => ({ ...res, kind: 'getListChild' }))));
    }

    const resLst = await Promise.all(listPromiseAll);
    return res.status(HttpStatus.OK).json({
      status: true,
      items: {
        $rltGet: resLst.filter(({ kind }) => kind === 'get'),
        $rltGetListRoot: resLst.filter(({ kind }) => kind === 'getListRoot'),
        $rltGetListParent: resLst.filter(({ kind }) => kind === 'getListParent'),
        $rltGetListChild: resLst.filter(({ kind }) => kind === 'getListChild')
      }
    });
  }
};

module.exports = rootCategoryController;
