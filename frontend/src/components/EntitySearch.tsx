import { Box, Spinner, useColorMode } from "@chakra-ui/react";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { Item } from "../data";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import useQuery from "../helpers/hooks/useQuery";
import { GroupBy } from "../helpers/search";
import { setSearchItems } from "../redux/actions/settings";
import Tag from "./Tag";

type SearchItemProps = {
  item: Item;
  clickHandler: (item: Item) => void;
};

function SearchItem({ item, clickHandler }: SearchItemProps) {
  return (
    <div
      className="flex items-center border-r-1 hover:shadow-md w-80"
      onClick={() => clickHandler(item)}
    >
      {item.img && (
        <div
          className="w-4 h-4 mr-2"
          style={{
            backgroundImage: `url('${item.img}')`,
            backgroundSize: "contain",
          }}
        />
      )}
      {item.color && (
        <div
          className="w-4 h-4 mx-1"
          style={{
            backgroundColor: item.color,
          }}
        />
      )}
      <span
        style={{
          textOverflow: "ellipsis",
        }}
        className="cursor-pointer"
      >
        {item.name}
      </span>
    </div>
  );
}

export default function EntitySearch() {
  const { colorMode } = useColorMode();
  const dispatch = useAppDispatch();
  const searchItems = useAppSelector((state) => state.settings.searchItems);
  const keyList = useAppSelector((state) => state.settings.keyList);
  const [query, setQuery] = useState("");
  const { data, loading } = useQuery({ query });
  const groupedResults =
    data && data.length > 0 ? GroupBy(data, "category") : undefined;
  const [closed, setClosed] = useState(true);

  return (
    <main
      className="z-20 absolute top-20 w-82 bg-white"
      style={{
        left: "8px",
        borderRadius: "8px",
      }}
    >
      <div
        className="p-1 rounded-md shadow-md"
        style={{
          backgroundColor: colorMode === "light" ? "#F0F2F5" : "#101827",
        }}
      >
        <div
          className={
            closed
              ? "flex w-32 justify-between cursor-pointer transition-all duration-300 ease-in-out"
              : "flex w-80 transition-all duration-300 ease-in-out"
          }
          onClick={() => setClosed(!closed)}
        >
          <p
            className={closed ? "p-2" : "p-2 mr-auto pl-0"}
            style={{ color: colorMode === "light" ? "#1F2937" : "white" }}
          >
            Search
          </p>
          {closed ? (
            <ArrowDownIcon
              className="w-4 mx-2"
              onClick={() => setClosed(!closed)}
            />
          ) : (
            <XMarkIcon
              className="w-4 mx-2 cursor-pointer"
              onClick={() => setClosed(!closed)}
            />
          )}
        </div>
        <div className={closed ? "hidden" : "inline-block"}>
          <div className="flex w-80 overflow-x-auto">
            {searchItems.map((item: Item, ix: number) => (
              <Tag
                key={ix}
                text={item.name}
                index={keyList.indexOf(item.category)}
                onClick={() =>
                  dispatch(
                    setSearchItems(
                      searchItems.filter(
                        (clicked: { name: string; category: string }) =>
                          clicked.name !== item.name ||
                          clicked.category !== item.category
                      )
                    )
                  )
                }
              />
            ))}
          </div>
          <input
            className="p-2 w-80 bg-transparent border border-solid border-lightGray rounded-md"
            type="search"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
            value={query}
            placeholder="Search through features"
          />
          {loading ? (
            <Box mt={1}>
              <Spinner color="blue.500" />
            </Box>
          ) : query && groupedResults ? (
            <div className="pt-2 h-72 overflow-x-auto cursor-pointer">
              {Array.from(groupedResults.entries()).map(
                ([category, data], ix) => (
                  <div key={ix}>
                    <h1 className="font-bold">{category.toUpperCase()}</h1>
                    {data.map((item: Item, index: number) => (
                      <SearchItem
                        key={index}
                        item={item}
                        clickHandler={(item) => {
                          if (
                            !searchItems.find(
                              (o: { name: string; category: string }) =>
                                o.name === item.name &&
                                o.category === item.category
                            )
                          ) {
                            dispatch(setSearchItems([...searchItems, item]));
                          }
                        }}
                      />
                    ))}
                  </div>
                )
              )}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
