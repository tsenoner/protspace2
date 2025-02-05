import React from 'react';

interface TechniquesDropdownProps {
  selectedTechnique: string;
  setSelectedTechnique: (technique: string) => void;
  setNNeighbours: (nNeighbours: number) => void;
  nNeighbours: number;
  setMinDist: (minDist: number) => void;
  minDist: number;
  setMetric: (metric: string) => void;
  metric: string;
  setTsneMetric: (metric: string) => void;
  tsneMetric: string;
  setIterations: (iterations: number) => void;
  iterations: number;
  setPerplexity: (perplexity: number) => void;
  perplexity: number;
  setLearningRate: (learningRate: number) => void;
  learningRate: number;
}
const metricList = [
  'euclidean',
  'cosine',
  'manhattan',
  'chebyshev',
  'minkowski',
  'canberra',
  'braycurtis',
  'haversine',
  'mahalanobis',
  'wminkowski',
  'seuclidean',
  'correlation',
  'hamming',
  'jaccard',
  'dice',
  'russellrao',
  'kulsinski',
  'rogerstanimoto',
  'sokalmichener',
  'sokalneath',
  'yule'
];
const techniqueList = ['umap', 'pca', 'tsne'];

const TechniquesDropdown: React.FC<TechniquesDropdownProps> = ({
  selectedTechnique,
  setSelectedTechnique,
  nNeighbours,
  setNNeighbours,
  minDist,
  setMinDist,
  metric,
  setMetric,
  tsneMetric,
  setTsneMetric,
  iterations,
  setIterations,
  perplexity,
  setPerplexity,
  learningRate,
  setLearningRate
}) => {
  const handleTechniqueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTechnique(event.target.value);
  };
  return (
    <div className="flex flex-col">
      <label htmlFor="techniques" className="text-gray-700 text-sm font-bold">
        Technique
      </label>
      <select
        onChange={handleTechniqueChange}
        id="techniques"
        className="mt-2 min-w-100 bg-transparent"
        value={selectedTechnique}
      >
        {techniqueList.map((option, index) => (
          <option key={index} value={option}>
            {option.toUpperCase()}
          </option>
        ))}
      </select>
      {selectedTechnique === 'umap' && (
        <div className="mt-2">
          <p className="mb-2 pt-2 border-t border-gray-100 font-bold">Parameters for UMAP</p>
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2">Number of Neighbors</label>
            <input
              className="text-center px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              type="number"
              step="1"
              min="1"
              max="50"
              value={nNeighbours}
              onChange={(e) => setNNeighbours(e.target.valueAsNumber)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2">Min Distance</label>
            <input
              className="text-center bg-white px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              type="number"
              step="0.1"
              min="1"
              max="1"
              value={minDist}
              onChange={(e) => setMinDist(e.target.valueAsNumber)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2" htmlFor="metric">
              Metric
            </label>
            <select
              onChange={(event) => {
                setMetric(event.target.value);
              }}
              id="metric"
              className="text-center px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              value={metric}
            >
              {metricList.map((option, index) => (
                <option key={index} value={option}>
                  {option.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {selectedTechnique === 'tsne' && (
        <div className="mt-2">
          <p className="mb-2 pt-2 border-t border-gray-100 font-bold">Parameters for TSNE</p>
          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2">Iterations</label>
            <input
              className="bg-white px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              type="number"
              step="500"
              min="1"
              max="5000"
              value={iterations}
              onChange={(e) => setIterations(e.target.valueAsNumber)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className=" text-gray-700 text-sm font-bold mr-2">Perplexity</label>
            <input
              className="bg-white px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              type="number"
              step="5"
              min="1"
              max="100"
              value={perplexity}
              onChange={(e) => setPerplexity(e.target.valueAsNumber)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2">Learning Rate</label>
            <input
              className="bg-white px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              type="number"
              step="1"
              min="1"
              max="10"
              value={learningRate}
              onChange={(e) => setLearningRate(e.target.valueAsNumber)}
            />
          </div>
          <div className="flex justify-between mb-4">
            <label className="text-gray-700 text-sm font-bold mr-2" htmlFor="tsneMectric">
              TSNE Metric
            </label>
            <select
              onChange={(event) => {
                setTsneMetric(event.target.value);
              }}
              id="tsneMetric"
              className="text-center px-1 py-1 text-center justify-center bg-white border border-solid border-lightGray rounded"
              value={tsneMetric}
            >
              {metricList.map((option, index) => (
                <option key={index} value={option}>
                  {option.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechniquesDropdown;
