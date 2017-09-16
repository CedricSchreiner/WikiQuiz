export function isUserloggedIn(): boolean {
  return (this.sessionStorage.getItem('email').isUndefined() ||
      this.sessionStorage.getItem('gamemode').isUndefined() ||
      this.sessionStorage.getItem('id').isUndefined() ||
      this.sessionStorage.getItem('link').isUndefined() ||
      this.sessionStorage.getItem('password').isUndefined() ||
      this.sessionStorage.getItem('username').isUndefined());
}
