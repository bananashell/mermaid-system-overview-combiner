import * as React from "react";
import Mermaid from "components/Mermaid";
import { produce } from "immer";

interface State {
    code: string;
}

class App extends React.Component<{}, State> {
    state: State = {
        code: "graph TD; Calippo --> Arca"
    };

    updateCode = (code: string) => {
        this.setState(
            produce<State>((draft) => {
                draft.code = code;
            })
        );
    };

    render() {
        return (
            <div>
                <textarea
                    onChange={(e) => this.updateCode(e.target.value)}
                    value={this.state.code}
                />
                <span>{this.state.code}</span>
                <Mermaid code={this.state.code} />
            </div>
        );
    }
}
export default App;
