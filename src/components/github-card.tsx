"use client";

import { Button } from "~/components/ui/button";
import { useEffect, useRef } from "react";
import type { GitHubUser } from "~/lib/types";
import { drawGitHubCard } from "~/lib/canvas-utils";

interface GitHubCardProps {
  userData: GitHubUser;
}

export function GitHubCard({ userData }: GitHubCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (userData && canvasRef.current) {
      drawGitHubCard(canvasRef.current, userData);
    }
  }, [userData]);

  const downloadCard = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `${userData.login}-github-card.png`;
    link.href = canvasRef.current.toDataURL("image/png", 1.0);
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width="600"
        height="400"
        className="rounded-lg border border-gray-700 shadow-2xl"
      />
      <Button onClick={downloadCard} variant="outline" className="w-fit">
        Download Card
      </Button>
    </div>
  );
}
