import { ATGIsmLimitedResponse } from '../models/models';
const axios = require('axios');
// const { axios } = require('axios');

export function getRandomAtgism(): Promise<ATGIsmLimitedResponse> {
  return http('get', '/atgism/random');
}

function http(method: 'get' | 'post' | 'put' | 'delete', path: string, params?: any, body?: any) {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: `/api${path}`,
      params: params,
      data: body,
    })
    .then(function(response: {data: any}) {
        console.log(`http response to "/api${path}"`, response);
        resolve(response.data.data);
      })
      .catch(function(err: any) {
        console.error(`http error to "/api${path}"`, err);
        reject(err);
      });
  });
}
