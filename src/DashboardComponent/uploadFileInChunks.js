// Add these constants and functions at the top of your file
const CHUNK_SIZE = 1024 * 1024; // 1MB per chunk

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const uploadFileInChunks = async (file, folder, onProgress) => {
  const fileId = generateUniqueId();
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedChunks = 0;

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  // Initialize upload with userId
  await fetch('http://localhost:5000/api/upload/init', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      totalChunks,
      folder,
      userId, // Include userId in the initialization
    }),
  });

  // Upload each chunk
  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('chunkIndex', chunkIndex);
    formData.append('totalChunks', totalChunks);
    formData.append('chunk', chunk);
    formData.append('userId', userId); // Include userId in each chunk upload

    await fetch('http://localhost:5000/api/upload/chunk', {
      method: 'POST',
      body: formData,
    });

    uploadedChunks++;
    const progress = Math.round((uploadedChunks / totalChunks) * 100);
    onProgress(progress);
  }

  // Complete the upload with userId
  const response = await fetch('http://localhost:5000/api/upload/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId,
      fileName: file.name,
      folder,
      userId, // Include userId in completion
    }),
  });

  const result = await response.json();
  onProgress(100);

  return {
    fileInfo: result.fileInfo,
    fileId: fileId
  };
};