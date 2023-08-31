import React from "react";
import TextComponent from "./Text";

const Background = () => {
  const styles = {
    backgroundColor: "#85C25C",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={styles}>
      <TextComponent /> {/* Include the TextComponent here */}
    </div>
  );
};

export default Background;
