import { fetchData } from './api';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
});

it('fetches data successfully', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: true,
    json: async () => ({ message: 'Success' })
  } as Response);

  const result = await fetchData();
  expect(result).toEqual({ message: 'Success' });
  expect(fetch).toHaveBeenCalledWith('/df_3FTx_mature_prott5.json');
});

it('throws an error when fetching fails', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({
    ok: false,
    statusText: 'Not Found'
  } as Response);

  await expect(fetchData()).rejects.toThrow('Failed to fetch data');
  expect(fetch).toHaveBeenCalledWith('/df_3FTx_mature_prott5.json');
});
