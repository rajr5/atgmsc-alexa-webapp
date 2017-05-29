export type ATGIsmLimitedResponse = {
  message: string,
  person: string,
  promotions?: ATGIsmPromote[],
}

export type ATGIsmPromote = {
  name: string;
  score: -1 | 0 | 1;
  added?: string | Date,
  updated?: string | Date,
}

export type ATGIsm = {
  message: string,
  person: string
  submittedBy: string,
  approved: boolean,
  added: string,
  updated: string,
}

export type ATGIsmInput = {
  person: string
  message: string,
  submittedBy: string,
  approved?: boolean,
}

export type ATGIsmPromoteInput = {
  person: string
  message: string,
  name: string,
  score: -1 | 0 | 1,
}

export type Auth = {
  access_token: string,
  token_type: string,
  scope: string,
  refresh_token: string,
  id_token: string,
  expires_in?: number,
  expires?: Date,
  fullName: string,
  displayName: string,
  mail: string,
  initials: string,
}

export interface RequestWithAuth {
  access_token: string,
  refresh_token: string,
  expires: String
}

export interface Alert {
  message: string;
  actionText: string;
  
}
