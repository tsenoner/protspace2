import { useEffect, useState } from "react";
import { useAppSelector } from ".";
import { Item } from "../../data";
import store from "../../redux/store";

const filter = (query: string): Promise<Item[]> => {
  const dataItems = store.getState().settings.dataItems;
  return dataItems!.filter((item: { name: string }) => {
    return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
  });
};

export const getData = (query: string): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(filter(query));
    }, 200);
  });
};

interface Output {
  data: Item[] | null;
  loading: boolean;
}

const useQuery = ({ query = "" }: { query: string }): Output => {
  const [data, setData] = useState<Item[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const dataItems = useAppSelector((state) => state.settings.dataItems);

  useEffect(() => {
    setLoading(true);
    const searchData = (): Item[] => {
      const lowercasedQuery = query.toLowerCase();
      return dataItems.filter((item: Item) => {
        return (
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.category.toLowerCase().includes(lowercasedQuery) ||
          item.id!.toLowerCase().includes(lowercasedQuery)
        );
      });
    };

    const delaySearch = setTimeout(() => {
      if (query) {
        const searchResults = searchData();
        setData(searchResults);
      } else {
        setData([]);
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(delaySearch);
  }, [query, dataItems]);

  return { data, loading };
};

export default useQuery;
