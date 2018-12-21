import * as React from "react";
import Mermaid from "components/Mermaid";
import { produce } from "immer";
import * as config from "config.json";
import { xor as _xor } from "lodash";
import { combineMermaid, convertToMermaidContent } from "markdownUtil";

interface State {
    activeSystems: string[];
}

class App extends React.Component<{}, State> {
    state: State = {
        activeSystems: []
    };

    toggleSystem = (system: { name: string; code: string }) => {
        this.setState(
            produce<State>((draft) => {
                draft.activeSystems = _xor(draft.activeSystems, [system.name]);
            })
        );
    };

    render() {
        const codes = config.systems
            .filter((s) => this.state.activeSystems.includes(s.name))
            .map((s) => s.code)
            .map(convertToMermaidContent);

        const combinedCode = combineMermaid(codes);

        return (
            <div>
                <div>
                    <span>Active:</span>
                    <span>{this.state.activeSystems.map((s) => s)}</span>
                </div>
                {config.systems.map((system, index) => {
                    return (
                        <button
                            key={index}
                            className={
                                this.state.activeSystems.includes(system.name) ? "active" : ""
                            }
                            onClick={() => this.toggleSystem(system)}
                        >
                            {system.name}
                        </button>
                    );
                })}

                <Mermaid code={combinedCode} />
            </div>
        );
    }
}
export default App;
