import { v4 as uuidv4 } from 'uuid';

const USER_KEY_STORAGE_KEY = 'prompthub_user_key';

export const getUserKey = (): string => {
    const storedKey = localStorage.getItem(USER_KEY_STORAGE_KEY);
    if (storedKey) {
        return storedKey;
    }

    const newKey = uuidv4();
    localStorage.setItem(USER_KEY_STORAGE_KEY, newKey);
    return newKey;
};
