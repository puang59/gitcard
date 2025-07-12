"use client";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { GitHubCard } from "~/components/github-card";
import { useState } from "react";
import type { GitHubUser } from "~/lib/types";

export default function HomePage() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGithubData = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
      };

      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`https://api.github.com/users/${username}`, {
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 403) {
          const remaining = response.headers.get("X-RateLimit-Remaining");
          const resetTime = response.headers.get("X-RateLimit-Reset");
          const resetDate = resetTime
            ? new Date(parseInt(resetTime) * 1000)
            : null;

          let message = "GitHub API rate limit exceeded.";
          if (remaining === "0" && resetDate) {
            message += ` Rate limit resets at ${resetDate.toLocaleTimeString()}.`;
          }
          message += " Try again later or add a GitHub personal access token.";

          throw new Error(message);
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }

      const data = (await response.json()) as GitHubUser;
      setUserData(data);
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (username) {
      void getGithubData();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="m-5 text-4xl italic">gitcard</h1>

      <section className="mb-8 flex gap-4">
        <Input
          type="text"
          placeholder="Enter GitHub username"
          className="w-64 rounded-lg px-4 py-2"
          id="username"
          name="username"
          autoComplete="off"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && username) {
              void getGithubData();
            }
          }}
        />
        <Button
          onClick={handleGenerate}
          disabled={loading || !username}
          className="px-6 py-2"
        >
          {loading ? "Loading..." : "Generate"}
        </Button>
      </section>

      {error && (
        <div className="mb-6 rounded-lg border border-red-500 bg-red-900/20 p-4 text-red-200">
          {error}
        </div>
      )}

      {userData && (
        <div className="mt-8">
          <GitHubCard userData={userData} />
        </div>
      )}
    </main>
  );
}
