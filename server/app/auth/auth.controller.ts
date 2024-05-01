import { Request, Response } from 'express';
import prisma from '../prisma_client.ts';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from '../common/setupEnv.ts';
import { isValidEmail, isValidPassword, isSafeString } from '../validations/userValidation.ts';

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
    //Validation
    const { email, name, password } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '' || !isSafeString(name)) {
      return res.status(400).json({ message: 'Invalid name' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || typeof password !== 'string' || !isValidPassword(password)) {
      return res.status(400).json({ message: 'Invalid password (minimum 6 characters)' });
    }

    const existingUser = await prisma.user.findFirst({ where: { email: email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
      },
    });
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, canPostEvents: user.canPostEvents, isAdmin: user.isAdmin },
      env.JWT_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ success: true, token });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid password' });
    }
    if (!doesUserExist(email)) {
      return res.status(401).json({ message: 'User does not exist with the given email' });
    }

    const user = await getUser(email);

    if (!user) {
      return res.status(401).json({ message: 'User does not exist with the given email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password as string);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const tokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      canPostEvents: user.canPostEvents,
      isAdmin: user.isAdmin,
    };

    const token = jwt.sign(tokenPayload, env.JWT_TOKEN_SECRET, { expiresIn: '1h' });

    return res.json({ success: true, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};
