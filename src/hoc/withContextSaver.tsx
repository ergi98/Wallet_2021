import React from "react";

const UpdatedComponent = (OriginalComponent: any) => {
  class NewComponent extends React.Component {
    saveContext(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    }
    render() {
      return <OriginalComponent saveContext={this.saveContext} />;
    }
  }

  return NewComponent;
};

export default UpdatedComponent;
