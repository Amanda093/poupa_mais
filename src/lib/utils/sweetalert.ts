"use client";

// configuração dos PopUps apresentados no site

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export const Popup = withReactContent(Swal).mixin({
  showConfirmButton: true,
  focusConfirm: true,
  customClass: {
    popup: "container-custom",
  },
  backdrop: "rgba(50, 66, 58, 0.6)",
});

/*
Exemplo:
Popup.fire({
    html: `<div><p>Cadastro realizado com sucesso!</p></div> `,
    icon: "success",
});
*/

export const Toast = withReactContent(Swal).mixin({
  toast: true,
  position: "bottom-right",
  iconColor: "white",
  customClass: {
    popup: "colored-toast",
  },
  showConfirmButton: false,
  timer: 6500,
  timerProgressBar: true,
});

/*
Exemplo:
Toast.fire({
    title: "Cadastro realizado com sucesso!",
    icon: "success",
});
*/
