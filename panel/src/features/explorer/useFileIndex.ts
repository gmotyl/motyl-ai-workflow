import { useState, useEffect } from "react";
import { useWebSocket } from "../realtime/useWebSocket";

export interface FileEntry {
  relativePath: string;
  project: string;
  modified: number;
}

export function useFileIndex() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const { lastMessage } = useWebSocket();

  const fetchFiles = async () => {
    const res = await fetch("/api/files/index");
    if (res.ok) setFiles(await res.json());
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (lastMessage?.type === "file-change") fetchFiles();
  }, [lastMessage]);

  return files;
}
