import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';
import { get } from 'http';

async function doesUserExist(email: string): Promise<boolean> {
  /**
   * Check if user exists in the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (user) {
    return true;
  }
  return false;
}

async function getUser(email: string) {
  /**
   * Get user from the database
   * Potentially throws an error from Prisma
   * @param email string - email of the user
   */
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return user;
}

//@ts-ignore
async function createUser(name: string, email: string, password: string) {
  /**
   * Create user in the database
   * Potentially throws an error from Prisma
   * @param name string - name of the user
   * @param email string - email of the user
   * @param password string - password of the user
   */
  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: password,
    },
  });
  return newUser;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }
    if (!doesUserExist(email)) {
      return res.status(401).send('User does not exist with the given email');
    }

    const user = await prisma.user.findFirst({
      where: email,
    });
    if (!user) {
      return res.status(401).send('User does not exist with the given email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ _id: user.id }, env.JWT_TOKEN_SECRET, { expiresIn: '1h' }); // Replace id with appropriate field

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
};

export const login = async (req: Request, res: Response) => {};
