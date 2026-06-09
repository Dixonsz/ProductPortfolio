import { useState } from "react";
import { uploadFile, deleteFile } from "../api/storage";

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  async function handleFileSelect(file, previousPath = null) {
    if (!file) return null;

    setPreview(URL.createObjectURL(file));
    setUploading(true)

    try {

      if (previousPath) await deleteFile(previousPath);
      const path = await uploadFile(file);

      return path

    } finally {
      setUploading(false);
    }
  }

  function clearPreview() {
    setPreview(null)
  }

  return { uploading, preview, handleFileSelect, clearPreview }
}
