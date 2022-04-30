import http from 'k6/http';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

const getProductsTrend = new Trend('Get Products');
const getProductTrend = new Trend('Get Product by ID');
const getStylesTrend = new Trend('Get Styles by ID');
const getRelatedTrend = new Trend('Get Related by ID');

export const options = {
  InsecureSkipTLSVerify: true,
  noConnectionReuse: false,
  stages: [
    { duration: '10s', target: 1000 },
    { duration: '30s', target: 1000 },
    // { duration: '10s', target: 1000 },
    // { duration: '3m', target: 1000 },
    // { duration: '10s', target: 100 },
    // { duration: '3m', target: 100 },
    // { duration: '10s', target: 0 },
  ],
};

export default () => {
  const API = 'http://3.16.109.109/products';
  const productId = Math.floor(Math.random() * 1000011);

  const requests = {
    'Get Products': {
      method: 'GET',
      url: API,
    },
    'Get Product by ID': {
      method: 'GET',
      url: `${API}/${productId}`,
    },
    'Get Styles by ID': {
      method: 'GET',
      url: `${API}/${productId}/styles`,
    },
    'Get Related by ID': {
      method: 'GET',
      url: `${API}/${productId}/related`,
    },
  };

  const responses = http.batch(requests);
  const getProductsResp = responses['Get Products'];
  const getProductResp = responses['Get Product by ID'];
  const getStylesResp = responses['Get Styles by ID'];
  const getRelatedResp = responses['Get Related by ID'];

  getProductsTrend.add(getProductsResp.timings.duration);
  getProductTrend.add(getProductResp.timings.duration);
  getStylesTrend.add(getStylesResp.timings.duration);
  getRelatedTrend.add(getRelatedResp.timings.duration);

  sleep(1);
};
