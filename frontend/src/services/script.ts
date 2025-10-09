// frontend/src/services/script.ts
import { ASSET_BASE } from "./config";

// Carga todas las imágenes de src/assets (png/jpg/jpeg/webp/gif/svg)
const localImages = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,gif,svg}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function onlyFileName(v: string) {
  const norm = v.replace(/\\+/g, "/");
  const parts = norm.split("/");
  return parts.pop() || v;
}

function findLocalAssetByFileName(fileName: string): string | null {
  const target = fileName.toLowerCase();
  // Busca por coincidencia exacta del nombre (case-insensitive)
  for (const path in localImages) {
    const name = path.split("/").pop()?.toLowerCase();
    if (name === target) return localImages[path];
  }
  return null;
}

export function resolveImageUrl(img?: string): string {
  if (!img) return "/placeholder.png";

  // URL absoluta
  if (/^https?:\/\//i.test(img)) return img;

  const file = onlyFileName(img);

  // 1) Busca en src/assets
  const local = findLocalAssetByFileName(file);
  if (local) return local;

  // 2) Fallback backend /uploads
  const encoded = encodeURIComponent(file);
  return `${ASSET_BASE}/uploads/${encoded}`;
}
