import React from "react";

// En tu pantalla principal o un Contexto
const [alertConfig, setAlertConfig] = React.useState({
  visible: false,
  title: '',
  message: '',
  resolve: (val: boolean) => {},
});

const confirmAction = (title: string, message: string): Promise<boolean> => {
  return new Promise((res) => {
    setAlertConfig({
      visible: true,
      title: title || "¿Estás seguro?",
      message: message || "",
      resolve: res,
    });
  });
};

// En el JSX de tu pantalla