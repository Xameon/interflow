import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { jwtSecretEncoded } from '@/lib/env';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '@/models/api/auth.model';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const payload = await request.json();

  try {
    SignUpCredentialsSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 }
    );
  }

  const { name, email, password, avatarUrl } = payload as SignUpCredentials;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const res = await pool.query(
      'INSERT INTO users (email, password_hash, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, name, avatarUrl]
    );

    const userId = res.rows[0].id;

    const token = await new SignJWT({ id: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(jwtSecretEncoded);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during sign-up', error },
      { status: 500 }
    );
  }
}
