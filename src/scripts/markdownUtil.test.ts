import { splitRowsOrSemicolon, convertToMermaidContent } from "markdownUtil";

describe("convertToMermaidContent", () => {
    it("basic example works", () => {
        const input = `
        \`\`\`mermaid
            graph TD;
            A --> B
            C --> A;
        \`\`\`
        `;

        const actual = convertToMermaidContent(input);
        expect(actual).not.toBeNull();
        expect(actual.type).toBe("graph TD");
        expect(actual.declarations.length).toBe(2);
    });
});

describe("splitRowsOrSemiColor", () => {
    it("basic example works", () => {
        const input = `
            graph TD;
            A --> B
            C --> A;
        `;

        const actual = splitRowsOrSemicolon(input);

        expect(actual[0]).toBe("graph TD");
        expect(actual[1]).toBe("A --> B");
        expect(actual[2]).toBe("C --> A");

        expect(actual.length).toBe(3);
    });
});
