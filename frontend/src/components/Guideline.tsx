// src/components/GuidelineComp.tsx

import React from "react";
import Nav from "./Nav";

const GuidelineComp: React.FC = () => {
  return (
    <div>
      <Nav />
      <div className="p-4">
        <h1>Guidelines</h1>
        <p>
          Welcome to the guidelines page. Here, you'll find the rules and
          guidelines for using this application.
        </p>
      </div>
    </div>
  );
};

export default GuidelineComp;
