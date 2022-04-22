const { pool } = require('../db/db');

module.exports = {
  getProducts: (page, count) => pool.query(`SELECT * FROM products ORDER BY id ASC LIMIT ${page * count}`),
  getProduct: (productId) => {
    const productQuery = new Promise((resolve, reject) => {
      pool.query(`SELECT * FROM products WHERE id=${productId}`, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows[0]);
      });
    });
    const featureQuery = new Promise((resolve, reject) => {
      pool.query(`SELECT feature, value FROM features WHERE productId=${productId}`, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows);
      });
    });
    return Promise.all([productQuery, featureQuery]);
  },
  getStyles: (productId) => pool.query(`SELECT id, name, salePrice, originalPrice, defaultStyle FROM styles WHERE productId=${productId}`),
  getPhotos: (styleId) => {
    const photosQuery = new Promise((resolve, reject) => {
      pool.query(`SELECT url, thumbnailUrl FROM photos WHERE styleId=${styleId}`, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows);
      });
    });
    return photosQuery;
  },
  getSkus: (styleId) => {
    const skusQuery = new Promise((resolve, reject) => {
      pool.query(`SELECT id, size, quantity FROM skus WHERE styleId=${styleId}`, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results.rows);
      });
    });
    return skusQuery;
  },
  getRelated: (productId) => pool.query(`SELECT relatedId FROM related WHERE productId=${productId}`),
};