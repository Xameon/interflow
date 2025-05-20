import { jwtVerify } from 'jose';

import { jwtSecretEncoded } from './env';

type JwtPayload = {
  id: string;
};

export const jwtTokenVerify = async (token?: string | null) => {
  try {
    const { payload } = await jwtVerify(token ?? '', jwtSecretEncoded);

    return payload as JwtPayload;
  } catch {
    return null;
  }
};
