import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits for file upload support (base64 image size)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-memory store for local uploaded images to serve them on a public URL for ASI:One
const uploadedImages = new Map<string, { buffer: Buffer; mimeType: string }>();

// Helper to store base64 string as a temporary buffer and return unique identity
function parseAndStoreBase64(base64Str: string): string {
  let mimeType = "image/jpeg";
  let base64Data = base64Str;
  
  const match = base64Str.match(/^data:(image\/\w+);base64,(.+)$/);
  if (match) {
    mimeType = match[1];
    base64Data = match[2];
  }
  
  const buffer = Buffer.from(base64Data, "base64");
  const id = `img_${crypto.randomBytes(8).toString("hex")}`;
  uploadedImages.set(id, { buffer, mimeType });
  return id;
}

// Public API endpoint so ASI:One can download the user's face photo
app.get("/uploads/:id", (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const image = uploadedImages.get(id);
  if (!image) {
    return res.status(404).send("Image not found");
  }
  res.setHeader("Content-Type", image.mimeType);
  res.send(image.buffer);
});

// Initialize Gemini SDK with client agent header for tracking
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Integration status endpoint to see if API keys are configured correctly
app.get("/api/integration-status", (req: express.Request, res: express.Response) => {
  res.json({
    asiOneActive: !!process.env.ASI_ONE_API_KEY,
    geminiActive: !!process.env.GEMINI_API_KEY,
  });
});

async function callAsiOneImageEdit(primaryImage: string, prompt: string): Promise<string> {
  const apiKey = process.env.ASI_ONE_API_KEY;
  if (!apiKey) {
    throw new Error("ASI_ONE_API_KEY is not defined in the environment.");
  }

  const response = await fetch("https://api.asi1.ai/v1/image/edit", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      images: [primaryImage],
      prompt: prompt,
      guidance_scale: 1.5,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ASI:One Face Swap API Error (${response.status}): ${errText}`);
  }

  const result: any = await response.json();
  const imageUrlOrBase64 = result.url || (result.images && result.images[0]);
  if (!imageUrlOrBase64) {
    throw new Error("ASI:One API response didn't return an image URL or base64.");
  }
  return imageUrlOrBase64;
}

async function callAsiOneImageGenerate(prompt: string): Promise<string> {
  const apiKey = process.env.ASI_ONE_API_KEY;
  if (!apiKey) {
    throw new Error("ASI_ONE_API_KEY is not defined in the environment.");
  }

  const response = await fetch("https://api.asi1.ai/v1/image/generate", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
      size: "1024x1024",
      model: "asi1-mini",
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ASI:One Generation API Error (${response.status}): ${errText}`);
  }

  const result: any = await response.json();
  const imageResult = (result.images && result.images[0]) || result.url;
  if (!imageResult) {
    throw new Error("ASI:One API response didn't return an image base64 format or URL.");
  }

  if (imageResult.startsWith("http") || imageResult.startsWith("data:")) {
    return imageResult;
  }
  return `data:image/png;base64,${imageResult}`;
}

// Face swap API endpoint using ASI:One API to perform image-to-image style composite
app.post("/api/face-swap", async (req: express.Request, res: express.Response) => {
  try {
    const { userImageBase64, userMimeType, templateImageUrl, templatePrompt } = req.body;

    if (!userImageBase64 || !templateImageUrl) {
      return res.status(400).json({ error: "Please upload your face photo first." });
    }

    if (!process.env.ASI_ONE_API_KEY) {
      return res.status(400).json({ error: "ASI_ONE_API_KEY is missing. Please configure it in the Secrets panel." });
    }

    // Convert local base64 upload into public asset URL so ASI:One can access it
    const imageId = parseAndStoreBase64(userImageBase64);
    const proto = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.get("host");
    const appUrl = (process.env.APP_URL || `${proto}://${host}`).replace(/\/$/, "");
    const publicImageUrl = `${appUrl}/uploads/${imageId}`;

    // Substitute face placeholder in premium descriptors to build custom prompt
    const basePrompt = (templatePrompt || "Cinematic Portrait Style").replace(/\[YOUR FACE\]/gi, "the face of the subject in this image");
    const enhancedPrompt = `${basePrompt}\nMake the changes look natural and seamless.\nMaintain good lighting and composition.`;

    const outputResult = await callAsiOneImageEdit(publicImageUrl, enhancedPrompt);
    return res.json({
      success: true,
      imageUrl: outputResult,
      integrationUsed: "asi-one",
    });

  } catch (err: any) {
    console.error("Face-swap API Error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during ASI One portrait generation. Ensure your ASI_ONE_API_KEY is valid." });
  }
});

// Dynamic customized agent synthesis endpoint using ASI:One edit image API
app.post("/api/agent-customize", async (req: express.Request, res: express.Response) => {
  try {
    const { userImageBase64, userMimeType, customStylePrompt } = req.body;

    if (!userImageBase64) {
      return res.status(400).json({ error: "Please upload your face photo first." });
    }

    if (!customStylePrompt || !customStylePrompt.trim()) {
      return res.status(400).json({ error: "Please describe the changes or style you want the ASI Agent to apply." });
    }

    if (!process.env.ASI_ONE_API_KEY) {
      return res.status(400).json({ error: "ASI_ONE_API_KEY is missing. Please configure it in the Secrets panel." });
    }

    // Convert local base64 upload into public asset URL so ASI:One can access it
    const imageId = parseAndStoreBase64(userImageBase64);
    const proto = req.headers["x-forwarded-proto"] || req.protocol;
    const host = req.headers["x-forwarded-host"] || req.get("host");
    const appUrl = (process.env.APP_URL || `${proto}://${host}`).replace(/\/$/, "");
    const publicImageUrl = `${appUrl}/uploads/${imageId}`;

    const enhancedPrompt = `${customStylePrompt}\nMake the changes look natural and seamless.\nMaintain good lighting and composition.`;

    const outputResult = await callAsiOneImageEdit(publicImageUrl, enhancedPrompt);
    return res.json({
      success: true,
      imageUrl: outputResult,
      integrationUsed: "asi-one",
    });

  } catch (err: any) {
    console.error("Agent Customize API Error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during custom ASI One agent synthesis. Ensure your ASI_ONE_API_KEY is valid." });
  }
});

// Configure Vite Dev Server or Static Production Build Middleware
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Registered Vite HMR middleware.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://localhost:${PORT}`);
  });
}

start();
