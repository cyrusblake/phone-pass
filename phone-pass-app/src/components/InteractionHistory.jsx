import React from "react";

const InteractionHistory = ({ interactions }) => {
  return (
    <div>
      <h2>Past Encounters</h2>
      <ul>
        {interactions.map((interaction, index) => (
          <li key={index}>{interaction.userName} - {interaction.timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default InteractionHistory;