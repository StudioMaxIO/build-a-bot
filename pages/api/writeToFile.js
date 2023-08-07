import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const { filePath, data } = req.body;
  const fileFullPath = path.join(process.cwd(), filePath);

  // if directory exists, write to file, if not, create directory
  if (!fs.existsSync(path.dirname(fileFullPath))) {
    fs.mkdirSync(path.dirname(fileFullPath));
  }

  try {
    let existingData = { messages: [] };
    // Write all messages back to the file
    fs.writeFileSync(
      fileFullPath,
      JSON.stringify({ messages: data.messages }, null, 4)
    );

    res.status(200).json({ message: "File successfully written" });
  } catch (error) {
    console.error("Error writing to file:", error);
    res.status(500).json({ message: "Error writing to file" });
  }
}
