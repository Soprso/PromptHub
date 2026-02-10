import type { PromptCategory } from "../../types/prompt";
import { aiImageGenerationPrompts } from "./ai-image-generation";
import { videoGenerationPrompts } from "./video-generation";
import { writingPrompts } from "./writing";
import { codingPrompts } from "./coding";
import { designPrompts } from "./design";
import { educationPrompts } from "./education";
import { businessPrompts } from "./business";
import { marketingPrompts } from "./marketing";
import { lifestylePrompts } from "./lifestyle";
import { productivityPrompts } from "./productivity";

export const promptCategories: PromptCategory[] = [
    aiImageGenerationPrompts,
    videoGenerationPrompts,
    writingPrompts,
    ...codingPrompts,
    ...designPrompts,
    ...educationPrompts,
    ...businessPrompts,
    ...marketingPrompts,
    ...lifestylePrompts,
    ...productivityPrompts,
];
