const MERMAID_REGEX = /```mermaid\s(.*?)\s```/s;

export const readMermaid = (markdownContents: string): string => {
    const regexResult = MERMAID_REGEX.exec(markdownContents);
    if (!regexResult) {
        return null;
    }

    return regexResult[1];
};
