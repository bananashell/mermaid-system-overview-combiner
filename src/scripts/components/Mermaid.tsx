import * as React from "react";
import mermaid from "mermaid";

interface Props {
    code: string;
}

export default class Mermaid extends React.PureComponent<Props> {
    render() {
        const mermaidOutput = mermaid.render(
            "randomId",
            "graph TD;\nCalippo --> Arca;",
            (svg) => {}
        );
        return <div dangerouslySetInnerHTML={{ __html: mermaidOutput }} />;
    }
}
