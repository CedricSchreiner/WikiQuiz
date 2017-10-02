export function isUserloggedIn(): boolean {
  return (sessionStorage.getItem('email') !== null &&
          sessionStorage.getItem('link') !== null &&
          sessionStorage.getItem('id') !== null &&
          sessionStorage.getItem('password') !== null &&
          sessionStorage.getItem('username') !== null);
}
