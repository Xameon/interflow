import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import { jwtSecret } from '@/lib/env';
import {
  SignUpCredentials,
  SignUpCredentialsSchema,
} from '@/models/api/auth.model';

export async function POST(request: Request) {
  const body = await request.json();

  try {
    SignUpCredentialsSchema.parse(body);
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid data', error },
      { status: 422 }
    );
  }

  const { name, email, password, avatarUrl } = body as SignUpCredentials;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const res = await pool.query(
      'INSERT INTO users (email, password_hash, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id',
      [email, hashedPassword, name, avatarUrl]
    );

    const userId = res.rows[0].id;

    const token = jwt.sign({ id: userId }, jwtSecret);

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error during sign-up', error: JSON.stringify(error) },
      { status: 500 }
    );
  }
}
