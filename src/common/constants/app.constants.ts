export class Constants {
  static readonly CollectionNames = {
    User: 'User',
    Category: 'Category',
    File: 'File',
    Post: 'Post',
  } as const;

  static readonly AllowedFileTypes = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'application/pdf',
  ] as const;
}

export enum UserRole {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  NORMAL_USER = 3,
}

export interface JwtPayload {
  _id: string;
  name: string;
  email: string;
  role: number;
}
