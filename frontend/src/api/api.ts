export const fetchData = async () => {
  const filePath = "/df_3FTx_mature_prott5.json";
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
