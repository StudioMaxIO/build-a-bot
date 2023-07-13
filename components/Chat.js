import React, { useState } from "react";

import ChatView from "./ChatView";

const Chat = ({ chatBot }) => {
  return (
    <div>
      <ChatView chatBot={chatBot} />
    </div>
  );
};

export default Chat;
