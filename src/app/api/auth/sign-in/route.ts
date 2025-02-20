import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { jwtSecret } from '@/lib/env';
import {
  SignInCredentials,
  SignInCredentialsSchema,
} from '@/models/api/auth.model';
import { DatabaseUser } from '@/models/api/users.model';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    SignInCredentialsSchema.parse(body);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 }
    );
  }

  const { email, password } = body as SignInCredentials;

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

    const token = jwt.sign({ id: user.id }, jwtSecret);

    return NextResponse.json({ token });
  } catch (e) {
    return NextResponse.json(
      { message: 'Error during sign-in', e },
      { status: 500 }
    );
  }
}
