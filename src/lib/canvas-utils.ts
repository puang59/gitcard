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

  // Calculate scaling factor based on canvas size
  const baseWidth = 600;
  const baseHeight = 400;
  const scaleX = canvasWidth / baseWidth;
  const scaleY = canvasHeight / baseHeight;
  const scale = Math.min(scaleX, scaleY);

  // Scaled dimensions and positions
  const avatarSize = 50 * scale;
  const avatarX = 80 * scale;
  const avatarY = 80 * scale;
  const contentStartX = 160 * scale;
  const padding = 30 * scale;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Background
  ctx.fillStyle = "#0d1117";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Border
  ctx.strokeStyle = "#21262d";
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, canvasWidth, canvasHeight);

  // Avatar
  const avatarImg = new Image();
  avatarImg.crossOrigin = "anonymous";
  avatarImg.onload = () => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(
      avatarImg,
      avatarX - avatarSize,
      avatarY - avatarSize,
      avatarSize * 2,
      avatarSize * 2,
    );
    ctx.restore();

    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, avatarSize, 0, 2 * Math.PI);
    ctx.stroke();
  };
  avatarImg.src = user.avatar_url;

  // Name
  ctx.fillStyle = "#f0f6fc";
  ctx.font = `bold ${Math.max(16, 32 * scale)}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(user.name ?? user.login, contentStartX, 60 * scale);

  // Username
  ctx.fillStyle = "#8b949e";
  ctx.font = `${Math.max(12, 20 * scale)}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`@${user.login}`, contentStartX, 85 * scale);

  // Bio
  if (user.bio) {
    ctx.fillStyle = "#e6edf3";
    ctx.font = `${Math.max(10, 16 * scale)}px system-ui, -apple-system, sans-serif`;

    const maxWidth = 400 * scale; // or however wide your content box is
    const lineHeight = 20 * scale;
    const words = user.bio.split(" ");
    const lines = [];

    let currentLine = "";
    for (const word of words) {
      const testLine = currentLine + word + " ";
      const { width: testWidth } = ctx.measureText(testLine);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    const startY = 110 * scale;
    lines.forEach((line, i) => {
      ctx.fillText(line.trim(), contentStartX, startY + i * lineHeight);
    });
  }

  // Company and Location
  let yPos = 160 * scale;
  const detailFontSize = Math.max(8, 14 * scale);

  if (user.company) {
    ctx.fillStyle = "#8b949e";
    ctx.font = `${detailFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText("Company:", padding, yPos);
    ctx.fillStyle = "#e6edf3";
    ctx.font = `${detailFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(user.company, 100 * scale, yPos);
    yPos += 25 * scale;
  }

  if (user.location) {
    ctx.fillStyle = "#8b949e";
    ctx.font = `${detailFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText("Location:", padding, yPos);
    ctx.fillStyle = "#e6edf3";
    ctx.font = `${detailFontSize}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(user.location, 100 * scale, yPos);
    yPos += 25 * scale;
  }

  // Statistics title
  ctx.fillStyle = "#f0f6fc";
  ctx.font = `bold ${Math.max(12, 18 * scale)}px system-ui, -apple-system, sans-serif`;
  ctx.fillText("GitHub Statistics", padding, yPos + 30 * scale);

  const statsY = yPos + 50 * scale;

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

  // Statistics boxes
  const boxWidth = 140 * scale;
  const boxHeight = 50 * scale;
  const boxSpacing = scale < 0.7 ? 10 * scale : 30 * scale;

  const statBoxes = [
    { label: "Repositories", value: user.public_repos.toString(), x: padding },
    {
      label: "Followers",
      value: user.followers.toString(),
      x: padding + boxWidth + boxSpacing,
    },
    {
      label: "Following",
      value: user.following.toString(),
      x: padding + (boxWidth + boxSpacing) * 2,
    },
  ];

  statBoxes.forEach(({ label, value, x }) => {
    // Skip if box would overflow
    if (x + boxWidth > canvasWidth) return;

    ctx.fillStyle = "#161b22";
    drawRoundedRect(x, statsY, boxWidth, boxHeight, 8 * scale);
    ctx.fill();

    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    drawRoundedRect(x, statsY, boxWidth, boxHeight, 8 * scale);
    ctx.stroke();

    ctx.fillStyle = "#8b949e";
    ctx.font = `${Math.max(8, 12 * scale)}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(label, x + 15 * scale, statsY + 20 * scale);

    ctx.fillStyle = "#f0f6fc";
    ctx.font = `bold ${Math.max(12, 20 * scale)}px system-ui, -apple-system, sans-serif`;
    ctx.fillText(value, x + 15 * scale, statsY + 42 * scale);
  });

  // Join date
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  ctx.fillStyle = "#8b949e";
  ctx.font = `${Math.max(8, 14 * scale)}px system-ui, -apple-system, sans-serif`;
  ctx.fillText(`Joined ${joinDate}`, padding, statsY + 90 * scale);

  // Branding
  const brandingText = `gitcard.puang.in`;
  ctx.fillStyle = "#6e7681";
  ctx.font = `${Math.max(8, 12 * scale)}px system-ui, -apple-system, sans-serif`;

  const textWidth = ctx.measureText(brandingText).width;
  const centerX = (canvasWidth - textWidth) / 2;
  ctx.fillText(brandingText, centerX, statsY + 130 * scale);
}
