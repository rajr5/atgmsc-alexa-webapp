// https://developer.microsoft.com/en-us/graph/docs/concepts/auth_v2_user

const TENANT = 'organizations';
const SCOPE = 'offline_access user.read openid profile';
const GRANT_TYPE = 'authorization_code';;

export function getExpires(tokenResponse: tokenResponse): Date {
  return new Date(Date.now() + (tokenResponse.expires_in * 1000));
}

export function objToParams(obj: any) {
  const params = Object.keys(obj).reduce((acc, curr, i, arr) => {
    if(obj[curr]) {
      acc += `${acc === '?' ? '' : '&'}${curr}=${obj[curr]}`;
    }
    return acc;
  }, '?');
  return encodeURI(params);
}

// redirect with these params - allows user to login
// https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
export function getRedirectConfig(finalUrl: string) {
  return {
    client_id: process.env.MSFT_APP_ID,
    response_type: 'code',
    redirect_uri: process.env.MSFT_REDIRECT_URI,
    response_mode: 'query',
    scope: SCOPE,
    state: finalUrl || 12345 // some value I would like to preserv
  }
}

// redirect with these params - allows user to login
// https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize
export function getLogoutConfig(redirectUrl: string) {
  return {
    post_logout_redirect_uri: redirectUrl
  }
}

// https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
export function getTokenAccessConfig(code: string) {
  return {
    client_id: process.env.MSFT_APP_ID,
    scope: SCOPE,
    code,
    redirect_uri: process.env.MSFT_REDIRECT_URI,
    grant_type: 'authorization_code',
    client_secret: process.env.MSFT_APP_SECRET
  }
}

export function getRefreshTokenAccessConfig(refreshToken: string) {
  return {
    client_id: process.env.MSFT_APP_ID,
    scope: SCOPE,
    refresh_token: refreshToken,
    redirect_uri: process.env.MSFT_REDIRECT_URI,
    grant_type: 'refresh_token',
    client_secret: process.env.MSFT_APP_SECRET
  }
}

export type tokenResponse = {
  token_type: string,
  scope: string,
  expires_in: number,
  access_token: string,
  refresh_token: string
}

export function getAuthURL(finalUrl?: string): string {
  let url = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/authorize`;
  return (url + objToParams(getRedirectConfig(finalUrl)));
}

export function getLogoutURL(finalUrl?: string): string {
  let url = `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/logout`;
  return (url + objToParams(getRedirectConfig(finalUrl)));
}

export function getTokenURL(): string {
  return `https://login.microsoftonline.com/${TENANT}/oauth2/v2.0/token`;
}