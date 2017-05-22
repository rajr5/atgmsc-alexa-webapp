export type ATGIsmLimitedResponse = {
  message: string,
  person: string
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
  submittedBy?: string,
  approved?: boolean,
}
