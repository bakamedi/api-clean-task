export class AuthUser {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public token?: string,
  ) {}

  setToken(token: string) {
    this.token = token;
  }
}
