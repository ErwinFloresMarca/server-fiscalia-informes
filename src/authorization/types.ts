import {UserProfile} from '@loopback/security';
import {SchemaObject} from 'openapi3-ts';
import {PermissionKey} from './permission-key';
export interface UserPermissionsFn {
  (
    userPermissions: PermissionKey[],
    requiredPermissions: RequiredPermissions,
  ): boolean;
}

export interface AuthUser extends UserProfile {
  id?: string;
  name: string;
  ci: string;
  permissions: PermissionKey[];
}

export interface RequiredPermissions {
  required: PermissionKey[];
}

export const UserProfileSchema = {
  type: 'object',
  required: ['ci', 'password', 'name'],
  properties: {
    ci: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
    name: {type: 'string'},
  },
};

export const UserRequestBody = {
  description: 'The input of create user function',
  required: true,
  content: {
    'application/json': {schema: UserProfileSchema},
  },
};

export interface AuthCredential {
  ci: string;
  password: string;
  permissions: PermissionKey[];
}

export const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['ci', 'password'],
  properties: {
    ci: {
      type: 'string',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};
