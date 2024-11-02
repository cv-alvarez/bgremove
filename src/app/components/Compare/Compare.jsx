import React, { useCallback, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { useDropzone } from "react-dropzone";
import Skeleton from "@mui/material/Skeleton";
import styles from "./compare.module.css";
import "two-up-element";
import { HexColorPicker } from "react-colorful";

const Compare = () => {
  const image =
    "https://res.cloudinary.com/dzbc0jija/image/upload/v1730404625/t0vmqvh7hr9gcbmf2cem.jpg";
  const cloudName = "dzbc0jija"; // Reemplaza con tu cloud name de Cloudinary
  const uploadPreset = "uibackground";
  const [uploadedImage, setUploadedImage] = useState(null); // URL original subida
  const [uploading, setUploading] = useState(false);
  const [isLoadingTransformed, setLoadingTransformed] = useState(true);
  const [overlayText, setOverlayText] = useState(""); // Estado para el texto del overlay
  const textRef = useRef(null); // Referencia para el texto oculto
  const [color, setColor] = useState("");
  const [colorInput, setColorInput] = useState("");

  const [inputText, setInputText] = useState(""); // Estado para el texto del input

  const [size, setSize] = useState({ height: 0, width: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionInput, setpositionInput] = useState({ x: 0, y: 0 });
  const [showInput, setShowInput] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file); // Adjunta el archivo
    formData.append("upload_preset", uploadPreset); // Adjunta el upload preset
    console.log(acceptedFiles, "accepted files");
    // Do something with the files
    try {
      setUploading(true); // Indicamos que estamos subiendo el archivo

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData, // El archivo se manda dentro de un FormData
        }
      );
      const data = await response.json();
      console.log(data, "data");
      setUploadedImage(data?.secure_url);
      setSize({ height: data?.height, width: data?.width });

      setLoadingTransformed(true);
      console.log(data?.secure_url, "response");
    } catch (error) {
      console.log(error, "err");
    }
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleClick = (event) => {
    const rect = event.target.getBoundingClientRect();

    // Obtener el tamaño original de la imagen
    const originalWidth = size?.width; // Asegúrate de tener el tamaño original de la imagen
    const originalHeight = size?.height;

    // Obtener las dimensiones actuales de la imagen
    const currentWidth = rect.width;
    const currentHeight = rect.height;

    // Calcular la escala
    const scaleX = originalWidth / currentWidth;
    const scaleY = originalHeight / currentHeight;

    // Obtener las coordenadas del clic
    const x = event.clientX - rect.left; // Posición X relativa dentro de la imagen
    const y = event.clientY - rect.top; // Posición Y relativa dentro de la imagen
    console.log(y, "y");

    // Invertir la coordenada Y
    const invertedY = currentHeight - y;
    console.log(invertedY, "invertedY");
    // Ajustar las coordenadas para el tamaño original
    const originalX = x * scaleX;
    const originalY = invertedY * scaleY;
    setpositionInput({ x: x, y: y });
    console.log(
      `Posición del clic en la imagen original: (${originalX}, ${originalY})`
    );

    setPosition({ x: parseInt(originalX), y: parseInt(originalY) });
    setShowInput(true);
  };
  const handleInputChange = (event) => {
    setInputText(event.target.value); // Actualiza el texto del input
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setShowInput(false); // Ocultar el input al presionar Enter
      setOverlayText(inputText); // Actualiza el overlay solo si se presiona Enter
    }
  };
  console.log(color, "ye");

  return (
    //   <CldImage
    //   width="500"
    //   height="500"
    //   src={image}
    //   crop="fill"
    //   removeBackground // Aplica la eliminación del fondo según el estado
    //   alt="Descripción de mi imagen"
    // />
    <>
      <div
        ref={textRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "wrap",
          fontFamily: "Source Sans Pro",
          fontSize: 24,
          fontWeight: "bold",
        }}
      >
        {overlayText}
      </div>
      <div
        style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}
        className={styles.main_container}
      >
        {uploadedImage ? (
          <>
            <two-up>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  style={{ maxWidth: "100%", maxHeight: "500px" }}
                />
              </div>
              {isLoadingTransformed ? (
                <div
                  style={{
                    width: "100%",
                    height: "auto", // Ajusta según lo necesites
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width={800}
                    height={700} // Ajusta según el tamaño deseado
                    sx={{ bgcolor: "#9c27b030" }}
                  />
                  <CldImage
                    width={parseInt(size?.width)}
                    height={parseInt(size?.height)}
                    src={uploadedImage}
                    removeBackground
                    alt="Descripción de mi imagen"
                    onLoad={() => {
                      console.log("dejo de cargar");
                      setLoadingTransformed(false); // Marca como no cargando
                    }}
                    className={styles.removedbgonload}
                  />
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CldImage
                    width={size?.width}
                    height={size?.height}
                    src={uploadedImage}
                    removeBackground
                    background={
                      color !== "" &&
                      color !== "NaNNaNNaN" &&
                      color !== "#NaNNaNNaN"
                        ? `rgb:${color?.replace("#", "")}`
                        : undefined
                    }
                    alt="Descripción de mi imagen"
                    onLoad={() => {
                      setLoadingTransformed(false); // Marca como no cargando
                    }}
                    onClick={handleClick}
                    className={styles.removedbg}
                    overlays={
                      overlayText !== ""
                        ? [
                            {
                              position: {
                                x: position?.x,
                                y: position?.y,
                                gravity: "south_west",
                              },
                              text: {
                                color:
                                  colorInput !== "" &&
                                  colorInput !== "NaNNaNNaN" &&
                                  colorInput !== "#NaNNaNNaN"
                                    ? `rgb:${colorInput?.replace("#", "")}`
                                    : "black",
                                fontFamily: "Source Sans Pro",
                                fontSize: 48,
                                fontWeight: "bold",
                                text: overlayText, // Usa el texto del estado
                              },
                            },
                          ]
                        : []
                    } // Condición para el overlay
                  />
                  {showInput && (
                    <input
                      type="text"
                      placeholder="Ingresa texto para el overlay"
                      value={inputText}
                      onChange={handleInputChange} // Actualiza el estado
                      onKeyDown={handleKeyDown} // Maneja el evento de tecla
                      style={{
                        position: "absolute",
                        left: `${positionInput.x}px`,
                        top: `${positionInput?.y}px`,
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "16px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        zIndex: 10,
                      }}
                      className={styles.inputMinimalista}
                    />
                  )}
                </div>
              )}
            </two-up>
          </>
        ) : (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #007BFF",
              padding: "40px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <p>Drag 'n' drop some files here, or click to select files</p>
            )}
          </div>
        )}
        {!isLoadingTransformed ? (
          <>
            <span>agregar color de fondo?</span>
            <HexColorPicker color={color} onChange={setColor} />
            <span>agregar color a texto</span>
            <HexColorPicker color={colorInput} onChange={setColorInput} />
          </>
        ) : null}
      </div>
    </>
  );
};

export default Compare;
