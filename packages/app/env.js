import { uuid } from '@digibird/common'

export const IS_DEV
    = !!localStorage.getItem('DEBUG') || process.env.NODE_ENV === 'development'

export const SESSION_SPAN = 1000 * 60 * 5

export const CLIENT_ID_HEADER_NAME = 'X-CLIENT-ID'

export const CLIENT_ID = uuid()

export const API_BASE_URL = '/darwin/service'

export const LOGIN_INFO_KEY = 'darwin-login-info'

export const LOGIN_LOAD_MSG = 'LOGIN_LOAD_MSG'
