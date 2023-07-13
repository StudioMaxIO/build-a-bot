import React, { useState } from "react";

import ChatView from "./ChatView";
import Assistant from "../bots/Assistant";

const Chat = ({}) => {
  const assistant = new Assistant();

  return (
    <div>
      <ChatView chatBot={assistant} />
    </div>
  );
};

export default Chat;
