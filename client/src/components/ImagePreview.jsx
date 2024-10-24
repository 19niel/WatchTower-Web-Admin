// ImagePreview.jsx
import React from "react";
import { Box, Modal, IconButton } from "@mui/material";
import { Close as CloseIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from "@mui/icons-material";

const ImagePreview = ({ open, images, currentIndex, onClose, onNext, onPrev }) => {
  if (!images.length) return null; // If no images, return null

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ backgroundColor: "rgba(0,0,0,0.8)", position: "relative" }}
      >
        <IconButton onClick={onClose} sx={{ position: "absolute", top: 20, right: 20, color: 'white' }}>
          <CloseIcon />
        </IconButton>

        <IconButton
          onClick={onPrev}
          sx={{ position: "absolute", left: 20, color: 'white' }}
          disabled={currentIndex === 0} // Disable if at the first image
        >
          <ArrowBackIcon />
        </IconButton>

        <img
          src={images[currentIndex]}
          alt={`Preview ${currentIndex + 1}`}
          style={{ maxWidth: "90%", maxHeight: "90%" }}
        />

        <IconButton
          onClick={onNext}
          sx={{ position: "absolute", right: 20, color: 'white' }}
          disabled={currentIndex === images.length - 1} // Disable if at the last image
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ImagePreview;
