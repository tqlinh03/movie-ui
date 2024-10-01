import axios from '@/app/config/axios-customize';
import {  IMovie } from '../types/backend';


// Module Auth
export const callLogin = (email: string, password: string) => {
  return axios.post('/api/v1/auth/authenticate', { email, password })
}

export const callSendCodeEmail = (email: string) => {
  return axios.post(`/api/v1/auth/sendValidationEmail?email=${email}`)
}

export const callRegister = (user: any) => {
  return axios.post('/api/v1/auth/register', {...user})
}

export const callActivateAccount= (token: string) => {
  return axios.get(`/api/v1/auth/activate-account?token=${token}`)
}

export const callLogout = () => {
  return axios.post("/api/v1/auth/logout")
}

export const callRefreshToken = () => {
  return axios.get('/api/v1/auth/refresh-token')
}

export const callFetchAccount = (accessToken: String) => {
  return axios.get(`/api/v1/auth/account?accessToken=${accessToken}`)
}

// Module Genre
export const callCreateGenre = (genre: any) => {
  return axios.post('/api/v1/genre', {...genre})
}

export const callFetchGenre = () => {
  return axios.get(`/api/v1/genre/all`)
}

//Module Movie 
export const callCreateMovie = (movie: IMovie) => {
  return axios.post(`/api/v1/movies`, {...movie})
}

export const callFetchMovie = (query: string) => {
  return axios.get(`/api/v1/movies?${query}`)
}

export const callGetMovieByIdAndDate = (id: number, date: String) => {
  return axios.get(`/api/v1/movies/movie-showtime/${id}/${date}`)
}

export const callFetchMovieById = (id: number) => {
  return axios.get(`/api/v1/movies/${id}`)
}

export const callDeleteMovie = (id: number) => {
  return axios.delete(`/api/v1/movies/${id}`)
}

export const callUpdateMovie = (id: number, movie: IMovie) => {
  return axios.patch(`/api/v1/movies/${id}`, {...movie})
}

// Module Point
export const callFetchPointOfUser = () => {
  return axios.get(`/api/v1/points/point-of-user`)
}

// Module DailyReward
export const callFetchDailyReward = () => {
  return axios.get(`/api/v1/daily-eward/all`)
}

// Module CheckinLog
export const callCreateCheckinLog = (checkin: any) => {
  return axios.post(`/api/v1/check-in`, {...checkin})
}
export const callFetchCheckinStreak = () => {
  return axios.get(`/api/v1/check-in/streak`)
}

// Module VipPackage
export const callFetchSVipPackage = () => {
  return axios.get(`/api/v1/vip-package/super-vip-all`)
}

// Module Vip
export const callPurchaseVip = (vip: any) => {
  return axios.post(`/api/v1/vip/purchaseVip`, {...vip})
}

export const callFetchVipUserInfo = () => {
  return axios.get(`/api/v1/vip/vip-user-info`)
}

// Module ExchangeRate 
export const callFetchLatestExchangeRate = () => {
  return axios.get(`/api/v1/exchange-rate/latest`)
}

// Module ExchangeRate
export const callCreatePaymentLink = (payment: any) => {
  return axios.post(`/api/v1/exchange/create-payment-link`, {...payment})
}

// Module Episode 
export const callCreateEpisode = (episode: any) => {
  return axios.post(`/api/v1/episode`, {...episode})
}

export const callUpdateEpisode = (id: number, episode: any) => {
  return axios.patch(`/api/v1/episode/${id}`, {...episode})
}

export const callDeleteEpisode = (id: number) => {
  return axios.delete(`/api/v1/episode/${id}`)
}

// Module View
export const callAddView = (view: any) => {
  return axios.patch(`/api/v1/view`, {...view})
}

export const callFetchViewId = (id: number) => {
  return axios.get(`/api/v1/view/${id}`)
}
