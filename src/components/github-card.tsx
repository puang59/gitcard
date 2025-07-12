"use client";

import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import type { GitHubUser } from "~/lib/types";
import { drawGitHubCard } from "~/lib/canvas-utils";

interface GitHubCardProps {
  userData: GitHubUser;
}

export function GitHubCard({ userData }: GitHubCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      const screenWidth = window.innerWidth;
      const maxWidth = screenWidth < 768 ? screenWidth - 32 : 600; // 16px padding on each side for mobile
      const aspectRatio = 600 / 400; // 3:2 aspect ratio
      const width = Math.min(maxWidth, 600);
      const height = width / aspectRatio;

      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (userData && canvasRef.current) {
      drawGitHubCard(canvasRef.current, userData);
    }
  }, [userData, dimensions]);

  const downloadCard = () => {
    if (!canvasRef.current) return;

    const link = document.createElement("a");
    link.download = `${userData.login}-github-card.png`;
    link.href = canvasRef.current.toDataURL("image/png", 1.0);
    link.click();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4 px-4 sm:px-0">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="h-auto w-full max-w-[600px] rounded-lg border border-gray-700 shadow-2xl"
      />
      <Button onClick={downloadCard} variant="outline" className="w-fit">
        Download Card
      </Button>
    </div>
  );
}
