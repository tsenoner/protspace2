import React from "react";

interface CardProps {
  id: string;
  text: string;
}

const Card: React.FC<CardProps> = ({ id, text }) => {
  return (
    <div id={id} data-testid={id} className="card">
      <p>{text}</p>
    </div>
  );
};

const CardMobile: React.FC<CardProps> = ({ id, text }) => {
  return (
    <div id={id} data-testid={id} className="cardMobile">
      <p>{text}</p>
    </div>
  );
};

export { Card, CardMobile };
