export const setTitle = (pageTitle: string | null) => {
  let fullTitle = "";
  if (pageTitle !== null) {
    fullTitle = `${pageTitle} | Poupa+`;
  } else {
    fullTitle = "Poupa+";
  }
  document.title = fullTitle;
};
