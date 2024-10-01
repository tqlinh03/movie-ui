export interface IBackendRes<T> {
  businessErrorCode?: number | string;
  businessErrorDescription?: string;
  error?: string | string[];
  message: string;
  satusCode: number | string;
  data?: T;
}
export interface IMeta {
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface IGetAccount extends Omit<IAccount, "access_token"> {}



export interface CheckinReward {
  id?: number;
  day: number;
  point: number;
}

export interface ExchangeRate {
  id?: number;
  currency: number;
  point: number;
}

export interface Episode {
  id?: number;
  title: string;
  episodeNumber: number;
  releaseDateTime: Date;
  movieUrl: string;
  point: number;
  payUntil: Date;
  view?: any;
}

export interface Vip {
  id?: number;
  vipStartDate: Date;
  vipEndDate: Date;
  vipPackageName: string;
  remainTime: string;
}

export interface VipPackage {
  id?: number;
  name: string;
  monthDuration: number;
  point: number;
}

export interface IMovie {
  id?: any;
  title: string;
  description: string;
  genreIds: string;
  genres?: any;
  director: string;
  cast: string;
  episodes?: Episode[];
  thumbnailUrl: string;

  createdDate?: Date;
  lastModifiedDate?: Date;
}

export interface IUser {
  id?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  email?: string;
  password?: string;
  accountLocked?: boolean;
  enabled?: boolean;

  createDate?: Date;
  lastModifiedDate?: Date;

}
