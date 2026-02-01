import { GoogleGenAI, Type } from '@google/genai';
// Strictly follow the SDK guideline to use process.env.API_KEY directly in initialization
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
export const checkContentSafety = async (text, imageBase64) => {
    try {
        const ai = getAI();
        const model = 'gemini-3-flash-preview';
        const parts = [
            {
                text: `Act as a content moderator for 'HVAC After Dark', an adult-oriented but NOT X-rated community for technicians. 
    BLOCK: Nudity, pornography, extreme gore, hate speech, or explicit sexual acts. 
    ALLOW: Rough language, dark humor, 'erotic' or moody aesthetics, pictures of dirty HVAC units, or questionable field finds.
    Return strictly JSON: { "safe": boolean, "reason": string }`
            }
        ];
        if (text)
            parts.push({ text: `Text to check: "${text}"` });
        if (imageBase64) {
            parts.push({
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: imageBase64.split(',')[1] || imageBase64
                }
            });
        }
        const response = await ai.models.generateContent({
            model,
            contents: { parts },
            config: {
                responseMimeType: 'application/json',
                // Using responseSchema is the recommended way to ensure consistent structured JSON output
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        safe: {
                            type: Type.BOOLEAN,
                            description: 'Whether the content is safe according to the guidelines.'
                        },
                        reason: {
                            type: Type.STRING,
                            description: 'Explanation for the safety determination.'
                        }
                    },
                    required: ['safe', 'reason']
                }
            }
        });
        // Correctly accessing the text property from GenerateContentResponse
        const responseText = response.text;
        return responseText ? JSON.parse(responseText) : { safe: true };
    }
    catch (error) {
        console.error('Safety check failed:', error);
        return { safe: true };
    }
};
