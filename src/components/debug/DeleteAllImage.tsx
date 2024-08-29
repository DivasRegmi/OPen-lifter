import React from "react";
import Button from "react-bootstrap/Button";
import { deleteAllImagesFromDB } from "../../logic/fileSystemUtils";

const DeleteAllImagesButton = () => {
  const handleDeleteAllImages = async () => {
    await deleteAllImagesFromDB(); // Utilize the utility function to delete all images
  };

  return (
    <Button variant="danger" onClick={handleDeleteAllImages}>
      Delete All Images
    </Button>
  );
};

export default DeleteAllImagesButton;
