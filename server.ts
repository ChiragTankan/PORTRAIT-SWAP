import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high limits for file upload support (base64 image size)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini SDK with client agent header for tracking
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Face swap API endpoint using Gemini model to perform image-to-image style composite
app.post("/api/face-swap", async (req: express.Request, res: express.Response) => {
  try {
    const { userImageBase64, userMimeType, templateImageUrl, templatePrompt } = req.body;

    if (!userImageBase64 || !templateImageUrl) {
      return res.status(400).json({ error: "Please upload your face photo first." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key is missing. Please configure GEMINI_API_KEY in the Secrets panel." });
    }

    // Clean base64 header
    const cleanBase64 = userImageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mime = userMimeType || "image/jpeg";

    // Download the template image on the server to pass it as base64 inlineData to Gemini
    let templateBase64 = "";
    let templateMime = "image/jpeg";
    try {
      const response = await fetch(templateImageUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        templateBase64 = Buffer.from(arrayBuffer).toString("base64");
        const contentType = response.headers.get("content-type");
        if (contentType) {
          templateMime = contentType;
        }
      } else {
        console.warn(`Template image download failed with status ${response.status}`);
      }
    } catch (e) {
      console.error("Failed to fetch template image from Unsplash:", e);
    }

    // Build the parts for the Multimodal edit/generate call
    const contentsParts: any[] = [];

    // Part 1: User uploaded portrait (Face source)
    contentsParts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mime,
      },
    });

    // Part 2: Template portrait (Aesthetic target)
    if (templateBase64) {
      contentsParts.push({
        inlineData: {
          data: templateBase64,
          mimeType: templateMime,
        },
      });
    }

    // Part 3: Specialized AI swap prompt
    const systemPromptText = `You are a professional cinematic portrait director and portrait lighting visual artist.
You have been given two images:
1. First image: The user's face photo (which provides facial contours, eye shape, nose structure, smile/lips, details, and facial features).
2. Second image: The desired artistic/cinematic aesthetic style template (which provides beautiful portrait lighting, specific clothes/goggles/armor, perfect studio lighting angles, a tailored focus backdrop, and resolution format).

Your single, critical goal is to take the face from the FIRST image and seamlessly transplant/blend/graft it into the SECOND image in place of the second image's face.
Ensure gorgeous blending so it is perfectly realistic. The skin tone, facial shadows, perspective angle, head orientation, and eye contact must dynamically blend with the second image's high-fashion or sci-fi ambient lighting.
The hair, pose, apparel, accessories (like glasses, hoods, or headphones), and deep cinematic textures of the second image must remain 100% untouched.
${templatePrompt ? `The template style description is: "${templatePrompt}"` : ""}

Return ONLY the final processed face-swapped cinematic portrait image. Do not add any text, boundaries, borders, comparison side-by-sides, or formatting blocks.`;

    contentsParts.push({
      text: systemPromptText,
    });

    // Invoke Gemini 2.5 general image editing model to yield high-quality blended portrait
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: contentsParts,
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4",
        }
      }
    });

    let outputBase64 = "";
    if (aiResponse?.candidates?.[0]?.content?.parts) {
      for (const part of aiResponse.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          outputBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!outputBase64) {
      console.warn("Failed to retrieve base64 data from Gemini response:", JSON.stringify(aiResponse));
      return res.status(500).json({ error: "The AI did not return a valid swapped image. Please try again with a clearer face photo." });
    }

    res.json({
      success: true,
      imageUrl: `data:image/png;base64,${outputBase64}`,
    });

  } catch (err: any) {
    console.error("Face-swap API Error:", err);
    res.status(500).json({ error: err.message || "An unexpected error occurred during portrait generation." });
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
