import * as React from "react";
import Mermaid from "components/Mermaid";
import { produce } from "immer";
import * as config from "config.json";
import { xor as _xor } from "lodash";

interface State {
    code: string;
    activeSystems: string[];
}

class App extends React.Component<{}, State> {
    state: State = {
        code: "graph TD; Calippo --> Arca",
        activeSystems: []
    };

    updateCode = (code: string) => {
        this.setState(
            produce<State>((draft) => {
                draft.code = code;
            })
        );
    };

    toggleSystem = (system: { name: string; code: string }) => {
        this.setState(
            produce<State>((draft) => {
                draft.activeSystems = _xor(draft.activeSystems, [system.name]);
            })
        );
    };

    render() {
        return (
            <div>
                {config.systems.map((system) => {
                    return (
                        <button
                            className={
                                this.state.activeSystems.includes(system.name) ? "active" : ""
                            }
                            onClick={() => this.toggleSystem(system)}
                        >
                            {system.name}
                        </button>
                    );
                })}

                <textarea
                    onChange={(e) => this.updateCode(e.target.value)}
                    value={this.state.code}
                />
                <Mermaid code={this.state.code} />
            </div>
        );
    }
}
export default App;
