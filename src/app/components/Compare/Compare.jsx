import React, { useCallback, useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { useDropzone } from "react-dropzone";
import Skeleton from "@mui/material/Skeleton";
import styles from "./compare.module.css";
import "two-up-element";
import { AiOutlineClose } from "react-icons/ai"; // Importa el ícono de cierre
import { HexAlphaColorPicker } from "react-colorful";
import { Tabs, Tab, Slider, Switch } from "@mui/material"; // Importar Tabs y Tab de Material-UI
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Compare = () => {
  const cloudName = "dpkcafrvf"; // Reemplaza con tu cloud name de Cloudinary
  const uploadPreset = "narutoremover";
  const [uploadedImage, setUploadedImage] = useState(null); // URL original subida
  const [uploading, setUploading] = useState(false);
  const [isLoadingTransformed, setLoadingTransformed] = useState(true);
  const [overlayText, setOverlayText] = useState(""); // Estado para el texto del overlay
  const textRef = useRef(null); // Referencia para el texto oculto
  const [color, setColor] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [backgroundImage, setbackgroundImage] = useState("");

  const [inputText, setInputText] = useState(""); // Estado para el texto del input
  const [positions, setPositions] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();

    setPositions({
      x: e.clientX + 10 - rect?.left,
      y: e.clientY - 10 - rect?.top,
    }); // Posiciona el texto a 10px del cursor
  };
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [positionInput, setpositionInput] = useState({ x: 0, y: 0 });
  const [showInput, setShowInput] = useState(false);
  const [value, setValue] = useState(0); // Estado para controlar la pestaña seleccionada

  const handleChange = (event, newValue) => {
    setValue(newValue); // Cambia el valor de la pestaña seleccionada
  };
  const onDropImage = useCallback(async (acceptedFiles) => {
    console.log(acceptedFiles, "accepted");
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
  const onDropBackground = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append("file", file); // Adjunta el archivo
    formData.append("upload_preset", uploadPreset); // Adjunta el upload preset
    console.log(acceptedFiles, "accepted files");
    // Do something with the files
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData, // El archivo se manda dentro de un FormData
        }
      );
      const data = await response.json();
      console.log(data, "data");
      setbackgroundImage(data?.public_id);
      // setLoadingTransformed(true);
      // console.log(data?.secure_url, "response");
    } catch (error) {
      console.log(error, "err");
    }
  }, []);

  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } =
    useDropzone({
      onDrop: onDropImage,
    });
  const {
    getRootProps: getRootPropsBackground,
    getInputProps: getInputPropsBackground,
  } = useDropzone({
    onDrop: onDropBackground,
    accept: "image/*", // Aceptar solo imágenes para fondo
  });
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
    console.log(inputRef.current, inputRef, "current");
    setShowInput(true);
    inputRef?.current?.focus();
  };
  const handleInputChange = (event) => {
    setInputText(event.target.value); // Actualiza el texto del input
  };
  const inputRef = useRef(null);
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setShowInput(false); // Ocultar el input al presionar Enter
      setOverlayText(inputText); // Actualiza el overlay solo si se presiona Enter
      setInputText("");
    }
  };
  const StyledTabs = styled(Tabs)({
    backgroundColor: "#f5f5f5", // Color de fondo de los tabs
    borderRadius: "4px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)", // Sombra para dar profundidad
    marginBottom: "16px", // Margen inferior para separar de otros elementos
  });

  // Estilizando los Tab
  const StyledTab = styled(Tab)({
    textTransform: "none", // Evita que el texto se convierta en mayúsculas
    fontWeight: "bold", // Texto en negrita
    color: "#1976d2", // Color del texto
    "&.Mui-selected": {
      backgroundColor: "#1976d2", // Color de fondo del tab seleccionado
      color: "#fff", // Color del texto del tab seleccionado
    },
    "&:hover": {
      backgroundColor: "#e3f2fd", // Color de fondo al pasar el ratón
    },
    "&.Mui-selected:hover": {
      backgroundColor: "#1976d2", // Color de fondo del tab seleccionado
    },
  });

  const pages = ["Products", "Pricing", "Blog"];
  const settings = ["Profile", "Account", "Dashboard", "Logout"];

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const clickClose = (event) => {
    setShowInput(false);
  };
  const [fontSize, setFontSize] = useState(30); // Estado para el tamaño de la letra
  const [blur, setBlur] = useState(0);
  const [blurOnchange, setblurOnchange] = useState(0);

  // Función para manejar cambios en el slider
  const handleSliderChange = (event, newValue) => {
    setFontSize(newValue); // Actualiza el estado con el nuevo tamaño
  };

  const handleSliderChangeBlur = (event, newValue) => {
    setBlur(newValue); // Actualiza el estado con el nuevo tamaño
  };
  const handleChangeCommitted = (event, value) => {
    setblurOnchange(value);
  };
  const valuetext = (value) => {
    return `${value}px`;
  };

  const [settingsChecked, setSettingsChecked] = useState({
    blur: false,
    gray: false,
  });

  const handleChangeSettings = (event) => {
    const { name, checked } = event.target;
    setSettingsChecked((prevSettings) => ({
      ...prevSettings,
      [name]: checked,
    }));
  };
  console.log(blur, "blur");
  const handleDownload = async (url) => {
    try {
      // Obtén los datos de la imagen desde la URL
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();

      // Crea un enlace de descarga
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "image.png"; // Cambia el nombre aquí si es necesario

      // Forzar la descarga
      link.click();

      // Libera el objeto URL después de que se complete la descarga
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Error descargando la imagen:", error);
    }
  };
  return (
    <>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              CustomRemoveBg
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" } }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography sx={{ textAlign: "center" }}>{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              LOGO
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

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
      <div style={{ padding: "20px" }} className={styles.main_container}>
        {uploadedImage ? (
          <>
            {isLoadingTransformed ? (
              <>
                <Skeleton
                  variant="rectangular"
                  width={1240}
                  height={600} // Ajusta la altura según lo que necesites
                  sx={{ bgcolor: "#9c27b030" }}
                  className={styles.skeleton}
                />
                <CldImage
                  width={100}
                  height={100}
                  src={uploadedImage}
                  // removeBackground
                  alt="Descripción de mi imagen"
                  onLoad={() => {
                    console.log("dejó de cargar");
                    setLoadingTransformed(false);
                  }}
                  onError={(error) => console.log(error, "e")}
                  className={styles.removedbgonload}
                />
              </>
            ) : (
              <div style={{ maxWidth: "800px", position: "relative" }}>
                <CldImage
                  width={size?.width}
                  height={size?.height}
                  blur={settingsChecked?.blur ? blurOnchange : 0}
                  src={uploadedImage}
                  // removeBackground
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
                              fontSize: fontSize,
                              fontWeight: "bold",
                              text: overlayText, // Usa el texto del estado
                            },
                          },
                        ]
                      : []
                  } // Condición para el overlay
                  // ID público de la imagen de underlay
                  underlay={backgroundImage !== "" ? backgroundImage : ""}
                />

                {showInput && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${positionInput.x}px`,
                      top: `${positionInput?.y}px`,
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <input
                      type="text"
                      placeholder={
                        overlayText !== "" ? "Change text..." : "Type text..."
                      }
                      value={inputText}
                      onChange={handleInputChange} // Actualiza el estado
                      onKeyDown={handleKeyDown} // Maneja el evento de tecla
                      style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        fontSize: "16px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        zIndex: 10,
                      }}
                      ref={inputRef} // Referencia para el auto-foco
                      className={styles.inputMinimalista}
                    />
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 100,
                        right: "-5px",
                        top: "-5px",
                        backgroundColor: "#000",
                        color: "#fff",
                        width: "20px", // Ancho del círculo
                        height: "20px", // Altura del círculo
                        borderRadius: "50%", // Crea un fondo circular
                        display: "flex", // Para centrar el icono
                        justifyContent: "center", // Centra horizontalmente
                        alignItems: "center", // Centra verticalmente
                      }}
                      onClick={clickClose}
                      className={styles.closeIcon}
                    >
                      <AiOutlineClose />
                    </div>
                  </div>
                )}

                <div
                  {...getRootPropsImage()}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "8px",
                    position: "relative",
                    width: "800px",
                    height: "500px",
                    margin: "20px auto",
                    boxSizing: "border-box",
                    backgroundColor: "transparent",
                    border: "2px  #1976d2", // Borde con estilo
                    boxShadow:
                      "0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 40px rgba(25, 118, 210, 0.3)", // Sombra suave y con color
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 10000,
                  }}
                >
                  <input
                    {...getInputPropsImage()}
                    style={{ display: "none" }}
                  />

                  <p
                    style={{
                      fontSize: "24px",
                      color: "#ffffff",
                      padding: "20px 40px",
                      borderRadius: "20px",
                      fontWeight: "bold",
                      backgroundColor: "#1976d2",
                      transition: "background-color 0.3s ease",
                      zIndex: 10000, // Suaviza el cambio de color
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1565c0")
                    } // Color al pasar el mouse
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#1976d2")
                    } // Color normal
                  >
                    Drag or Upload your image
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            {...getRootPropsImage()}
            style={{
              padding: "40px",
              textAlign: "center",
              cursor: "pointer",
              borderRadius: "8px",
              position: "relative",
              width: "800px",
              height: "500px",
              margin: "20px auto",
              boxSizing: "border-box",
              backgroundColor: "transparent",
              border: "2px  #1976d2", // Borde con estilo
              boxShadow:
                "0 8px 20px rgba(0, 0, 0, 0.15), 0 12px 40px rgba(25, 118, 210, 0.3)", // Sombra suave y con color
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10000,
            }}
          >
            <input {...getInputPropsImage()} style={{ display: "none" }} />

            <h1>Remove backgrounds instantly.</h1>
            <p>
              <strong>Remove backgrounds</strong> from your images in seconds
              and customize them with new backgrounds using our advanced{" "}
              <strong>AI editing tools</strong>.
            </p>

            <p
              style={{
                fontSize: "24px",
                color: "#ffffff",
                padding: "20px 40px",
                borderRadius: "20px",
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                transition: "background-color 0.3s ease",
                zIndex: 10000, // Suaviza el cambio de color
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1565c0")
              } // Color al pasar el mouse
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#1976d2")
              } // Color normal
            >
              Drag or Upload your image
            </p>
          </div>
        )}
        {!isLoadingTransformed ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
              }}
            >
              <StyledTabs
                value={value}
                onChange={handleChange}
                aria-label="color tabs"
              >
                <StyledTab label="Background" />
                <StyledTab label="Text Options" />
                <StyledTab label="Otra opción" />
              </StyledTabs>

              {value === 0 && (
                <div className={styles.bgColorContainer}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#000",
                      padding: "0 20px",
                    }}
                  >
                    Background Color:
                  </span>
                  <HexAlphaColorPicker
                    color={color}
                    onChange={setColor}
                    style={{
                      width: "100%",
                      padding: "5px 20px",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#000",
                      padding: "0 20px",
                    }}
                  >
                    Add Background image:
                  </span>
                  <div
                    {...getRootPropsBackground()}
                    style={{
                      padding: "10px",
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      position: "relative",
                      width: "100px",
                      height: "100px",
                      margin: "10px auto",
                      boxSizing: "border-box",
                      backgroundColor: "transparent",
                      border: "2px solid #1976d2",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 10000,
                    }}
                  >
                    <input
                      {...getInputPropsBackground()}
                      style={{ display: "none" }}
                    />
                    <AddCircleOutlineIcon
                      style={{ fontSize: "48px", color: "#1976d2" }}
                    />
                  </div>
                </div>
              )}
              {value === 1 && (
                <div className={styles.bgColorContainer}>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#000",
                      padding: "0 20px",
                    }}
                  >
                    Text Color:
                  </span>
                  <HexAlphaColorPicker
                    style={{
                      width: "100%",
                      padding: "5px 20px",
                      boxSizing: "border-box",
                    }}
                    color={colorInput}
                    onChange={setColorInput}
                  />{" "}
                  <label
                    htmlFor=""
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "#000",
                      padding: "0 20px",
                    }}
                  >
                    Font size
                  </label>
                  <Slider
                    value={fontSize} // Valor del slider
                    min={0} // Tamaño mínimo
                    max={400} // Tamaño máximo
                    onChange={handleSliderChange} // Manejador de cambios
                    getAriaValueText={valuetext} // Texto accesible
                    sx={{
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#1976d2", // Color del pulgar
                      },
                      "& .MuiSlider-track": {
                        border: "none",
                        backgroundColor: "#1976d2", // Color de la pista
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#7abbfb", // Color del riel
                      },
                      "& .MuiSlider-valueLabel": {
                        backgroundColor: "#fff", // Color de fondo del value label
                        border: "1px solid #1976d2",
                      },
                    }}
                    style={{
                      margin: "0 auto",
                      width: "90%",
                    }}
                  />
                </div>
              )}
              {value === 2 && (
                <div className={styles.bgColorContainer}>
                  <span>Other configuration options: :</span>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label
                      htmlFor=""
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#000",
                        padding: "0 5px",
                      }}
                    >
                      blur{" "}
                    </label>
                    <Switch
                      onChange={handleChangeSettings}
                      checked={settingsChecked.blur}
                      name="blur"
                    />
                  </div>
                  {settingsChecked?.blur ? (
                    <Slider
                      style={{
                        margin: "0 auto",
                        width: "90%",
                      }}
                      value={blur} // Valor del slider
                      min={0} // Tamaño mínimo
                      max={2000} // Tamaño máximo
                      onChange={handleSliderChangeBlur} // Manejador de cambios
                      onChangeCommitted={handleChangeCommitted}
                      getAriaValueText={valuetext} // Texto accesible
                      sx={{
                        "& .MuiSlider-thumb": {
                          backgroundColor: "#1976d2", // Color del pulgar
                        },
                        "& .MuiSlider-track": {
                          border: "none",
                          backgroundColor: "#1976d2", // Color de la pista
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "#7abbfb", // Color del riel
                        },
                        "& .MuiSlider-valueLabel": {
                          backgroundColor: "#fff", // Color de fondo del value label
                          border: "1px solid #1976d2",
                        },
                      }}
                    />
                  ) : null}
                </div>
              )}
            </div>

            <button onClick={() => handleDownload(uploadedImage)}>
              Descargar Imagen
            </button>
          </div>
        ) : null}
        <div className={isLoadingTransformed ? styles.spot : ""}></div>
      </div>
    </>
  );
};

export default Compare;
