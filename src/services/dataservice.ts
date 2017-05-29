import { ATGIsmInput, ATGIsmPromoteInput, ATGIsmLimitedResponse, Auth, RequestWithAuth } from '../models/models';
import { updateRefreshedToken } from './auth';
const axios = require('axios');
// const { axios } = require('axios');



export function getRandomAtgism(): Promise<ATGIsmLimitedResponse> {
  return http('get', '/atgism/random');
}

export function createAtgism(data: ATGIsmInput): Promise<null> {
  return http('post', '/atgism', null, data);
}

export function promoteAtgism(data: ATGIsmPromoteInput): Promise<ATGIsmLimitedResponse> {
  return http('put', '/atgism/promote', null, data);
}

export function getUserPhoto(auth: Auth): Promise<{image: string}> {
  let params: RequestWithAuth = {
    access_token: auth.access_token,
    refresh_token: auth.refresh_token,
    expires: auth.expires.toJSON(),
  };
  return http('get', '/user/photo', params);
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
        // if refresh token was provided with response, update localStorage with updated creds
        if(response.data && response.data.data && response.data.data.auth) {
          updateRefreshedToken(response.data.data.auth);
          console.log('Updated refresh token, removing auth from response');
          delete response.data.data.auth;
        }
        resolve(response.data.data);
      })
      .catch(function(err: any) {
        console.error(`http error to "/api${path}"`, err);
        reject(err);
      });
  });
}
