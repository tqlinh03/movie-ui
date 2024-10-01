import 'axios';

declare module 'axios' {
  interface AxiosResponse<T = any> {
    businessErrorCode?: number;
    businessErrorDescription?: string;
    error?: string;
  }
}