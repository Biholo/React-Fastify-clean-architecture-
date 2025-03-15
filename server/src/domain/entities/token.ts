import { TokenType } from "../enum/tokenEnums";

export type CreateToken = {
    ownedById: string;
    token: string;
    type: TokenType;
    scopes: string;
    deviceName: string;
    deviceIp: string;
    expiresAt: Date;
  };
  
  export type Token = CreateToken & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
  }; 