import React from 'react';

export class ErrorBoundary extends React.Component<any, {children?: any; hasError: boolean}> {
  constructor(props: any) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(_error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, info: any) {
    console.log({error, info});
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <div>
            <div>
              <p>Uy! Parece que te topaste con un error!</p>
              <p>Ya hemos recibido el informe...</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
