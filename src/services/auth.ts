import { Auth } from '../models/models';

const NS: string = 'ALEXA-ATGISMS';

function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function clearURLQueryParams() {
  console.info('Clearing query params from URL path');
  if (history.pushState) {
    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.pushState({path:newurl},'',newurl);
  }
}

export function checkQueryParams(): boolean {
  if(location && location.search) {
    const params = getJsonFromUrl();
    if(params && params['access_token']) {
      setLS('auth', params);
      clearURLQueryParams();
      return true;
    }
  }
  return false
}

export function getAuth(): Auth {
  const ls = getLS();
  if(ls && ls.auth) {
    return ls.auth;
  } else {
    return null;
  }
}

export function updateRefreshedToken(data: {access_token: string, refresh_token: string, expires: string}) {
  const auth = getAuth();
  if(auth) {
    auth.access_token = data.access_token;
    auth.refresh_token = data.refresh_token;
    auth.expires = new Date(data.expires);
    // save updated auth to LS
    setLS('auth', auth);
  }
}

export function getAccessToken() {
  const ls = getLS();
  if(ls && ls.auth) {
    return ls.auth.access_token;
  } else {
    return null;
  }
}

export function setLS(key: string, obj: any) {
  if(!localStorage.getItem(NS)) {
    localStorage.setItem(NS, '{}');
  }
  let ls = getLS();
  ls[key] = obj;
  console.info('setting local storage for ' + key, ls[key]);
  localStorage.setItem(NS, JSON.stringify(ls));
}

export function getLSByKey(key: string) {
  const ls = getLS();
  if(ls) {
    console.info('local storage for ' + key, ls[key]);
    return ls[key];
  }
  return null;
}

export function getLS(): {auth: Auth} {
  const ls: {auth: Auth} = JSON.parse(localStorage.getItem(NS));
  let auth: Auth = ls.auth;
  if(auth) {
    if(typeof(auth.expires) === 'string') {
      auth.expires = new Date(auth.expires); 
    }
    if(typeof(auth.expires_in) === 'string') {
      auth.expires_in = Number.parseInt(auth.expires_in);
    }
  }

  console.log('local storage:', ls);
  return ls;
}