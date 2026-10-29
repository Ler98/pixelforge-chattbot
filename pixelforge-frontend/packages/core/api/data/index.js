export const fetchProducts = async () => {
  const response = await fetch(
    "https://santosnr6.github.io/Data/pixelforgeproducts.json",
  );
  //hämtar produktinfo från extern källa.
  //fetch = hämta

  if (!response.ok) {
    throw new Error("Något gick fel vid API-anropet");
  }

  const data = await response.json();

  return data;
};

export const fetchDocuments = async () => {
  //hämtar supportdokument som chatbotten senare ska kunna använda för att svara på frågor om exempelvis returer
  const response = await fetch(
    "https://santosnr6.github.io/Data/pixelforgedocuments.json",
  );

  if (!response.ok) {
    throw new Error("Något gick fel vid API-anropet");
  }

  const data = await response.json();

  return data;
};
