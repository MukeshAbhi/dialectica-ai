import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface EnhanceRequest {
    message: string;
    mode?: "formal" | "persuasive" | "concise" | "neutral";
}

router.post("/enhance-message", async (req: Request, res: Response): Promise<void> => {
    try {
        const { message, mode = "formal" } = req.body as EnhanceRequest;

        if (!message || message.trim().length === 0) {
            res.status(400).json({ error: "Message cannot be empty" });
            return;
        }

        const modeInstructions = {
            formal: "Make it more structured and articulate while maintaining conviction.",
            persuasive: "Enhance persuasiveness and logical flow without being aggressive.",
            concise: "Make it shorter and punchier while keeping the core argument.",
            neutral: "Soften emotional language while preserving the original point.",
        };

        const prompt = `You are an AI assistant helping users refine their debate arguments. 
    
Your task: Enhance the following debate message by improving grammar, tone, and logical flow while keeping the original meaning intact.
Enhancement mode: ${modeInstructions[mode]}

IMPORTANT RULES:
- Keep the message roughly the same length (don't add new arguments)
- Preserve the original intent and stance
- Fix grammar and punctuation
- Improve clarity and structure
- Remove redundancy
- Keep it conversational, not robotic

Original message:
"${message}"

RESPOND ONLY with the enhanced message. No explanations, no quotes, no prefix/suffix. Just the improved text.`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const enhancedMessage = result.response.text().trim();

        res.status(200).json({
            original: message,
            enhanced: enhancedMessage,
            mode,
        });
    } catch (error) {
        console.error("Enhancement error:", error);
        res.status(500).json({
            error: "Failed to enhance message",
            details: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default router;