import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/db';
import { jwtSecretEncoded } from '@/lib/env';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '@/models/auth.model';

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as SignUpCredentials;

  try {
    SignUpCredentialsSchema.parse(payload);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 },
    );
  }

  const { name, email, password, avatarUrl } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const res = await pool.query(
      'INSERT INTO users (email, password_hash, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, name, avatarUrl],
    );

    const userId = res.rows[0].id;

    const token = await new SignJWT({ id: userId })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(jwtSecretEncoded);

    const response = NextResponse.json(
      {
        message: 'User created successfully',
      },
      { status: 201 },
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during sign-up', error },
      { status: 500 },
    );
  }
}
