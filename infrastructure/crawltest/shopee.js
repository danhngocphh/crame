const axios = require('axios').default;

const category_list = async () => {
  const { data } = await axios.get(
    'https://shopee.vn/api/v2/category_list/get?match'
  );
  console.log(data.data.category_list.length);
  return data;
};

const getProduct = async (_categoryid) => {
  try {
    const { data } = await axios.get(
      'https://shopee.vn/api/v2/search_items/?by=pop&match_id='+ _categoryid +'&order=desc&page_type=search&version=2',
      {
        headers: {
          'Referer': 'https://shopee.vn',
        }
      }
    );
    // console.log(data.items);
    return data.items;
  } catch (error) {
    console.log(error);
  }
};

const addProduct = async (_categoryid) => {
    const _items = await getProduct(_categoryid);
    let _products = _items.map(o => ({
        productid: o.itemid,
        storeid: "shopee",
        categoryid: "shopee_" +_categoryid,
        slug: "...",
        url: "https://shopee.vn/product/"+ o.shopid +"/"+ o.itemid,
        name: o.name,
        price: o.price,
        pricemin: o.price_min,
        pricemax: o.price_max,
        brand: o.brand,
        type: o.item_type
      }))

    return _products;

}

addProduct(84).then((result)=>console.log(result));
