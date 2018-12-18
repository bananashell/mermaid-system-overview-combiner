import * as React from "react";
import mermaid from "mermaid";
import { withErrorBoundary, ErrorBoundaryProps } from "components/error/WithErrorBoundary";

interface OwnProps {
    code: string;
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
        try {
            mermaid.parse(this.props.code);
        } catch (e) {
            return <div>{e.str}</div>;
        }

        const mermaidOutput = mermaid.render(
            `test-${Date.now() % 100}`,
            this.props.code,
            (svg) => {}
        );

        return <div dangerouslySetInnerHTML={{ __html: mermaidOutput }} />;
    }
}

export default withErrorBoundary(Mermaid);
