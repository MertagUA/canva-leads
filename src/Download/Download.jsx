import React from "react";

const DownloadButton = ({ state }) => {
  const downloadExcel = () => {
    fetch(`https://princesss.store/api/canva/download-excel?state=${state}`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        // Create a link element
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "canva_data.xlsx");

        // Append to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading the file:", error));
  };

  return (
    <button onClick={downloadExcel} className="table-cell">
      Download Excel
    </button>
  );
};

export default DownloadButton;
