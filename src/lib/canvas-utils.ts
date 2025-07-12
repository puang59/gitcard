import type { GitHubUser } from "./types";

export function drawGitHubCard(
  canvas: HTMLCanvasElement,
  user: GitHubUser,
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  ctx.scale(dpr, dpr);
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";

  const canvasWidth = rect.width;
  const canvasHeight = rect.height;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  ctx.strokeStyle = "#21262d";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

  const avatarImg = new Image();
  avatarImg.crossOrigin = "anonymous";
  avatarImg.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 80, 50, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(avatarImg, 30, 30, 100, 100);
    ctx.restore();

    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(80, 80, 50, 0, 2 * Math.PI);
    ctx.stroke();
  };
  avatarImg.src = user.avatar_url;

  ctx.fillStyle = "#f0f6fc";
  ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
  ctx.fillText(user.name ?? user.login, 160, 60);

  ctx.fillStyle = "#8b949e";
  ctx.font = "20px system-ui, -apple-system, sans-serif";
  ctx.fillText(`@${user.login}`, 160, 85);

  if (user.bio) {
    ctx.fillStyle = "#e6edf3";
    ctx.font = "16px system-ui, -apple-system, sans-serif";
    const bio =
      user.bio.length > 65 ? user.bio.substring(0, 65) + "..." : user.bio;
    ctx.fillText(bio, 160, 110);
  }

  let yPos = 160;
  if (user.company) {
    ctx.fillStyle = "#8b949e";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText("Company:", 30, yPos);
    ctx.fillStyle = "#e6edf3";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText(user.company, 100, yPos);
    yPos += 25;
  }

  if (user.location) {
    ctx.fillStyle = "#8b949e";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText("Location:", 30, yPos);
    ctx.fillStyle = "#e6edf3";
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText(user.location, 100, yPos);
    yPos += 25;
  }

  ctx.fillStyle = "#f0f6fc";
  ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
  ctx.fillText("GitHub Statistics", 30, yPos + 30);

  const statsY = yPos + 50;

  const drawRoundedRect = (
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const statBoxes = [
    { label: "Repositories", value: user.public_repos.toString(), x: 30 },
    { label: "Followers", value: user.followers.toString(), x: 200 },
    { label: "Following", value: user.following.toString(), x: 370 },
  ];

  statBoxes.forEach(({ label, value, x }) => {
    ctx.fillStyle = "#161b22";
    drawRoundedRect(x, statsY, 140, 50, 8);
    ctx.fill();

    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    drawRoundedRect(x, statsY, 140, 50, 8);
    ctx.stroke();

    ctx.fillStyle = "#8b949e";
    ctx.font = "12px system-ui, -apple-system, sans-serif";
    ctx.fillText(label, x + 15, statsY + 20);

    ctx.fillStyle = "#f0f6fc";
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.fillText(value, x + 15, statsY + 42);
  });

  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  ctx.fillStyle = "#8b949e";
  ctx.font = "14px system-ui, -apple-system, sans-serif";
  ctx.fillText(`Joined ${joinDate}`, 30, statsY + 90);

  const brandingText = `gitcard.com | @${user.login}`;
  ctx.fillStyle = "#6e7681";
  ctx.font = "12px system-ui, -apple-system, sans-serif";

  const textWidth = ctx.measureText(brandingText).width;
  const centerX = (canvasWidth - textWidth) / 2;
  ctx.fillText(brandingText, centerX, statsY + 130);
}
