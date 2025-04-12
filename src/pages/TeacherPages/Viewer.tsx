import React from 'react';

const ViewerModal = ({ path, onClose }) => {
  const getContentType = (path) => {
    const extension = path.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      // Add more cases as needed
      default:
        return 'unknown';
    }
  };

  const contentType = getContentType(path);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-3/4 h-3/4">
        <button onClick={onClose} className="float-right">Close</button>
        {contentType === 'application/pdf' && (
          <iframe src={`${path}#toolbar=0`} width="100%" height="100%"></iframe>
        )}
        {contentType === 'image' && (
          <img src={path} alt="Content" className="max-w-full max-h-full" />
        )}
        {contentType === 'unknown' && (
          <p>Unable to display this file type. Please download to view.</p>
        )}
      </div>
    </div>
  );
};

export default ViewerModal;