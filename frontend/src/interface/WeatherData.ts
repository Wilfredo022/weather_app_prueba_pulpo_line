export interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
    lat: number;
    lon: number;
    localtime_epoch: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: string;
    };
    wind_kph: number;
    humidity: number;
  };
}
