function clusterData(data: any[], gridSize: number) {
  const clusters: { [key: string]: any } = {};
  data.forEach(
    (point: { coordinates: { x: number; y: number; z: number } }) => {
      const x = Math.floor(parseFloat(point.coordinates.x as any) / gridSize);
      const y = Math.floor(parseFloat(point.coordinates.y as any) / gridSize);
      const z = Math.floor(parseFloat(point.coordinates.z as any) / gridSize);
      const key = `${x}_${y}_${z}`;

      if (!clusters[key]) {
        clusters[key] = {
          points: [],
          center: { x: 0, y: 0, z: 0 },
          key,
        };
      }
      clusters[key].points.push(point);
      clusters[key].center.x += parseFloat(point.coordinates.x as any);
      clusters[key].center.y += parseFloat(point.coordinates.y as any);
      clusters[key].center.z += parseFloat(point.coordinates.z as any);
    }
  );

  // Calculate the centroid of each cluster
  Object.keys(clusters).forEach((key) => {
    const cluster = clusters[key];
    const len = cluster.points.length;
    cluster.center.x /= len;
    cluster.center.y /= len;
    cluster.center.z /= len;
  });

  return clusters;
}

export default clusterData;
