import * as React from "react";
import { Subtract } from "utility-types";

import "./error-boundary.scss";

const MISSING_ERROR = "Error was swallowed during propagation.";

export interface ErrorBoundaryProps {
    onReset: () => any;
    hasError: boolean;
}

export const withErrorBoundary = <WrappedProps extends ErrorBoundaryProps>(
    WrappedComponent: React.ComponentType<WrappedProps>
) => {
    type HocProps = Subtract<WrappedProps, ErrorBoundaryProps> & {};
    interface HocState {
        readonly error: Error | null | undefined;
    }

    return class WithErrorBoundary extends React.Component<HocProps, HocState> {
        static displayName = `withErrorBoundary(${WrappedComponent.name})`;

        readonly state: HocState = {
            error: undefined
        };

        componentDidCatch(error: Error | null, info: object) {
            this.setState({ error: error || new Error(MISSING_ERROR) });
        }

        handleReset = () => {
            this.setState({ error: undefined });
        };

        render() {
            const { children, ...restProps } = this.props as {
                children: React.ReactNode;
            };
            const { error } = this.state;

            if (error) {
                return (
                    <React.Fragment>
                        <i className="error-marker" style={{ display: "none" }}>
                            💥
                        </i>
                        <WrappedComponent
                            {...restProps}
                            hasError={true}
                            onReset={this.handleReset} // injected
                        />

                        <details>
                            <summary>
                                💣 {error.name} {error.message}
                            </summary>
                            {error.stack}
                        </details>
                    </React.Fragment>
                );
            }

            return <WrappedComponent {...restProps} hasError={false} onReset={this.handleReset} />;
        }
    };
};
