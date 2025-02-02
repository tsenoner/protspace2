export const transformCoordinates = (data: any) => {
  return data.map((item: any) => {
    const { coordinates } = item;
    if (typeof coordinates.x === "number") {
      coordinates.x = coordinates.x.toString();
    }
    if (typeof coordinates.y === "number") {
      coordinates.y = coordinates.y.toString();
    }
    if (typeof coordinates.z === "number") {
      coordinates.z = coordinates.z.toString();
    }
    return item;
  });
};
