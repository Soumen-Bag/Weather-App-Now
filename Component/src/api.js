import axios  from "./axios"
export const getWeather = (url, query) => {
  return axios({
    method: 'GET',
    url: url,
    params: {
      q: query,
      key: 'b456b674f2eb4da0a5553806220106',
      aqi: 'yes',
      days: 3,
    },
  })
}