export default interface IConfig {
  token: string;
  devToken: string;
  database: string;
  clientID?: string;
  devClientID?: string;
  homeGuild?: string;
  errorChannel?: string;
}
