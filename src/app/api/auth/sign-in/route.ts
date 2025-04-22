import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { jwtSecretEncoded } from '@/lib/env';
import {
  SignInCredentials,
  SignInCredentialsSchema,
} from '@/models/api/auth.model';
import { DatabaseUser } from '@/models/api/users.model';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    SignInCredentialsSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 }
    );
  }

  const { email, password } = payload as SignInCredentials;

  try {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    const user = res.rows[0] as DatabaseUser | undefined;

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await new SignJWT({ id: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(jwtSecretEncoded);

    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json(
      { message: 'Error during sign-in', e },
      { status: 500 }
    );
  }
}
