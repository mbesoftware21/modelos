export async function obtenerModelos() {
  try {
    const response = await fetch("http://localhost:3000/modelos");
    if (!response.ok) throw new Error("Error al obtener modelos");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return []; // o lanza el error según lo necesites
  }
}
