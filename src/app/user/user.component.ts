export class User {
  static user: UserData;
}

interface UserData {
  avatar_link: string;
  e_mail: string;
  id: number;
  name: string;
  passwort: string;
}
