import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allowed file extensions and their MIME type prefixes/values
const ALLOWED_EXTENSIONS = new Set([
  // Images
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg",
  // Documents
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx",
  // Audio
  ".mp3", ".wav", ".ogg", ".m4a",
  // Video
  ".mp4", ".webm", ".mov",
]);

// Secondary MIME type check — allow known safe types (never trust octet-stream alone)
function isSafeType(mimeType: string): boolean {
  return (
    mimeType.startsWith("image/") ||
    mimeType.startsWith("audio/") ||
    mimeType.startsWith("video/") ||
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/vnd.ms-excel" ||
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-powerpoint" ||
    mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  );
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { error: "Failed to parse upload. File may be too large." },
        { status: 400 }
      );
    }

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate by extension (primary) — more reliable than MIME type across browsers/OS
    const ext = path.extname(file.name).toLowerCase();
    if (!ext) {
      return NextResponse.json(
        { error: "File has no extension" },
        { status: 400 }
      );
    }

    // Allow if extension is valid (handles Windows sending application/octet-stream)
    // OR if MIME type is explicitly safe and extension is unknown
    const extAllowed = ALLOWED_EXTENSIONS.has(ext);
    const typeAllowed = !extAllowed && isSafeType(file.type);

    if (!extAllowed && !typeAllowed) {
      return NextResponse.json(
        { error: `File type "${ext || file.type}" is not allowed` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const uniqueFilename = `${Date.now()}${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Write file to disk
    const filePath = path.join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    const url = `/uploads/${uniqueFilename}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
