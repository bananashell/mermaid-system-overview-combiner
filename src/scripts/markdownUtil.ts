const MERMAID_REGEX = /```mermaid\s(.*?)\s```/s;

interface MermaidContent {
    type: string;
    declarations: string[];
}

const parseMermaid = (markdownContents: string): string => {
    const regexResult = MERMAID_REGEX.exec(markdownContents);
    if (!regexResult) {
        throw new Error("Could not find mermaid in markdown");
    }

    return regexResult[1].trim().replace("\t", "");
};

export const splitRowsOrSemicolon = (content: string): string[] => {
    if (!content) {
        return null;
    }

    const rows = content.split(/[\r\n;]+/);

    return rows.map((r) => r.trim()).filter((r) => r && r.length > 0);
};

export const convertToMermaidContent = (markdown: string): MermaidContent => {
    const mermaidContent = parseMermaid(markdown);
    const rows = splitRowsOrSemicolon(mermaidContent);

    if (!rows || rows.length === 0) {
        return null;
    }

    const output: MermaidContent = {
        type: rows[0],
        declarations: rows.splice(1)
    };

    return output;
};

export const combineMermaid = (...mermaidContents: MermaidContent[]) => {};
