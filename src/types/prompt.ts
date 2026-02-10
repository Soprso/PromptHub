export type Prompt = {
    id: string;
    title: string;
    content: string;
    tags?: string[];
};

export type PromptFolder = {
    id: string;
    name: string;
    icon?: string;
    prompts: Prompt[];
    subfolders?: PromptFolder[];
};

export type PromptCategory = {
    id: string;
    name: string;
    icon?: string;
    description?: string;
    folders: PromptFolder[];
};
