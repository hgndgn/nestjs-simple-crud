export interface UserDto {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  email: string;
  roles?: string[];
}
