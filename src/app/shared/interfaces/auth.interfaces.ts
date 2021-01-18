export interface IAuthResponse {
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
  client_id: string;
  sub: string;
  auth_time: number;
  idp: string;
  userId: string;
  userRole: string;
  username: string;
  email: string;
  company?: string;
  scope: string[];
  amr: string[];
  isAnonymous: string;
  isHeadOfCompany: string;
}

export interface IAuth {
  access_token: string;
  expires_in: string;
  token_type: string;
  refresh_token: string;
}

/**
 * @description Basic model for authentication
 */
export interface ILoginBase {
  client_id?: string;
  grant_type?: string;
  scope?: string;
  guest_secret?: string;
}

/**
 * @description Basic model for sending credentials
 */
export interface ILogin extends ILoginBase {
  username: string;
  password: string;
}

/**
 * @description Login request for authorization
 */
export interface ILoginAuth extends ILoginBase {
  refresh_token: string;
}

export interface IError {
  invalid: boolean;
  error: string;
}

export interface IPathTuple {
  originalPath: string;
  fallbackPath: string;
}
