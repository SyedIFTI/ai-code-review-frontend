export interface User {
  id: string;
  githubId: string;
  username: string;
  email: string;
  avatarUrl?: string;
  stripeCustomerId?: string;
  role: 'free' | 'pro';
  dailyReviewCount: number;
  lastReviewDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

