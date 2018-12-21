import * as React from "react";
import mermaid from "mermaid";
import { withErrorBoundary, ErrorBoundaryProps } from "components/error/WithErrorBoundary";
import { MermaidContent } from "markdownUtil";

interface OwnProps {
    code: MermaidContent;
}

type Props = OwnProps & ErrorBoundaryProps;

export class Mermaid extends React.PureComponent<Props> {
    componentDidMount() {
        mermaid.initialize({});
    }

    render() {
        if (this.props.hasError) {
            return <div>💩</div>;
        }
        const code =
            this.props.code &&
            `${this.props.code.type}; ${this.props.code.declarations.join("; ")}`;
        console.log(code);
        try {
            mermaid.parse(code);
        } catch (e) {
            return <div>{e.str}</div>;
        }

        const mermaidOutput = mermaid.render(`test-${Date.now() % 100}`, code, (svg) => {});

        return <div dangerouslySetInnerHTML={{ __html: mermaidOutput }} />;
    }
}

export default withErrorBoundary(Mermaid);
