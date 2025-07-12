export interface GitHubUser {
  avatar_url: string;
  bio: string | null;
  blog: string;
  company: string | null;
  created_at: string;
  email: string | null;
  followers: number;
  following: number;
  html_url: string;
  id: number;
  location: string | null;
  login: string;
  name: string | null;
  public_gists: number;
  public_repos: number;
  twitter_username: string | null;
  type: string;
  updated_at: string;
}
