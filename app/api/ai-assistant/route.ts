import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key) {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-assistant',
          }
        }
      });
    }
  }
  return aiClient;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    const ai = getAI();
    if (ai) {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are ClinicOS AI, an elite clinical intelligence system. Provide crisp, professional, clinical-grade analysis. Keep responses concise (under 4 sentences) and styled beautifully in Markdown format with bold highlights. Do not use conversational filler.",
          temperature: 0.2,
        }
      });
      return NextResponse.json({ success: true, text: response.text?.trim() });
    } else {
      // Elegant clinical fallback
      const simulatedResponses: Record<string, string> = {
        "hello": "Welcome to ClinicOS Clinical Intelligence Node. I am ready to parse diagnostic records, review endocrinology levels, or analyze billing efficiency datasets.",
        "billing": "Receivables Audit: Paid fees currently total $10,400 with $2,650 outstanding (20.3% lag risk). We recommend clearing manual bill adjustments on patient Eleanor Vance to reduce aging liability.",
        "readings": "Patient Telemetry Warning: Biological monitor logs indicate Eleanor Vance has persistent high systolic readings (148/95 mmHg). Recommend immediate fasting endocrine panel review.",
        "reports": "S3 Data Lockbox: 4 key clinical summary scans are awaiting diagnostic finalization. OCR presets are armed for instantaneous PDF transcript abstractions."
      };
      
      const lowerPrompt = prompt.toLowerCase();
      let selectedText = "Active Workspace Diagnostics: All AWS Aurora and Cognito directory parameters are healthy. Please enter a request regarding patient vitals, clinical invoices, or lab panel abstracts.";
      
      for (const [key, value] of Object.entries(simulatedResponses)) {
        if (lowerPrompt.includes(key)) {
          selectedText = value;
          break;
        }
      }

      return NextResponse.json({ success: true, text: `[Simulated Model Response]\n\n${selectedText}` });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
