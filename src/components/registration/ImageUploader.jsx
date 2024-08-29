import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTrashAlt, faCheck } from "@fortawesome/free-solid-svg-icons";
import AvatarEditor from "react-avatar-editor";
import { saveImageToDB, getImageFromDB, deleteImageFromDB } from "../../logic/fileSystemUtils";
import { Modal, Button, Form } from "react-bootstrap";
import Styles from "./ImageUploader.module.scss"; // Import the SCSS module

function ImageUploader({ id }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const editorRef = useRef(null);

  const handleSaveImage = async () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas(); // Get the cropped and scaled image from the canvas
      const croppedImage = canvas.toDataURL(); // Convert the canvas to a base64 string

      await saveImageToDB(croppedImage, id); // Save the cropped image to IndexedDB
      setImageSrc(croppedImage); // Set the image source to display it
      setIsModalOpen(false); // Close the modal
    }
  };

  const handleFileChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      const reader = new FileReader();
      reader.onload = () => {
        setCroppingImage(reader.result); // Show the image in the editor
        setIsModalOpen(true); // Open the modal for cropping
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleDeleteImage = async () => {
    await deleteImageFromDB(id);
    setImageSrc(null); // Clear the displayed image after deletion
  };

  const handleGetImage = async () => {
    const base64Image = await getImageFromDB(id);
    if (base64Image) {
      setImageSrc(base64Image); // Set the image source to display it
    } else {
      setImageSrc(null); // Clear the image source if not found
    }
  };

  useEffect(() => {
    // Automatically load the image with the given ID when the component mounts
    handleGetImage(id);
  }, [id]);

  if (!id) {
    return <></>;
  }

  return (
    <div className={Styles["image-uploader"]}>
      {!imageSrc && (
        <Form.Label htmlFor={`upload-${id}`} className={Styles["upload-box"]}>
          <div className={Styles["upload-placeholder"]}>
            <FontAwesomeIcon icon={faUpload} size="2x" />
            <span>Upload Image</span>
          </div>
        </Form.Label>
      )}
      {imageSrc && (
        <div className={Styles["image-container"]}>
          <img src={imageSrc} alt="Uploaded" className={Styles["uploaded-image"]} />
          <Button variant="danger" className={Styles["delete-button"]} onClick={handleDeleteImage}>
            <FontAwesomeIcon icon={faTrashAlt} size="2x" />
          </Button>
        </div>
      )}
      <Form.Control id={`upload-${id}`} type="file" onChange={handleFileChange} style={{ display: "none" }} />

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Crop Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AvatarEditor
            ref={editorRef}
            image={croppingImage}
            width={300}
            height={300}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1.2}
            rotate={0}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveImage}>
            <FontAwesomeIcon icon={faCheck} /> Done
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ImageUploader;
