const previewFile = async (file, setFile, setImagePreview) => {
  setFile(file);
  if (!postMessage) {
    document
      .getElementById('post-form-textarea')
      .style.removeProperty('height');
  }

  const url = URL.createObjectURL(file);
  setImagePreview(url);
};

export default previewFile;
