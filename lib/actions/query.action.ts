"use server";

import crypto from 'crypto';
import { RuleGroupType } from "react-querybuilder";
import redis from '@/lib/redis';

export const saveQuery = async (query: RuleGroupType): Promise<string> => {
  const queryString = JSON.stringify(query);

  const hash = crypto
    .createHash('sha256')
    .update(queryString)
    .digest('hex')
    .substring(0, 12);
  
    const key = `query:${hash}`;
    await redis.set(key, queryString, 'EX', 60 * 60 * 24 * 3); // Store for 3 days

    return hash;
}

export const getQuery = async (hash: string): Promise<RuleGroupType | null> => {
  const queryString = await redis.get(`query:${hash}`);
  if (!queryString) return null;

  try {
    return JSON.parse(queryString);
  } catch {
    return null;
  }
}