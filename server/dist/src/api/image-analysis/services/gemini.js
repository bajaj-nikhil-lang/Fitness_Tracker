"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = void 0;
const genai_1 = require("@google/genai");
const fs_1 = __importDefault(require("fs"));
// npm run develop
// npm install @google/genai
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const analyzeImage = async (filePath) => {
    try {
        const base64ImageFile = fs_1.default.readFileSync(filePath, {
            encoding: "base64",
        });
        const contents = [
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: base64ImageFile,
                },
            },
            { text: "Extract the food name and estimated calories from this image in a JSON object." },
        ];
        const config = {
            responseMimeType: "application/json",
            responseJsonSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    calories: { type: "number" },
                }
            }
        };
        const response = await ai.models.generateContent({
            // model: "gemini-3-flash-preview",
            model: "gemini-2.5-flash",
            contents: contents,
            config
        });
        // response.text should be valid JSON matching the schema
        return JSON.parse(response.text);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.analyzeImage = analyzeImage;
