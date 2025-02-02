import React, { useState } from "react";
import { Box, Spinner, useColorMode } from "@chakra-ui/react";
import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useAppDispatch, useAppSelector } from "../helpers/hooks";
import useQuery from "../helpers/hooks/useQuery";
import { setSearchItems } from "../redux/actions/settings";
import Tag from "./Tag";

interface Item {
  id: string;
  name: string;
  category: string;
  img?: string;
}

function SearchItem({
  item,
  clickHandler,
}: {
  item: Item;
  clickHandler: (item: Item) => void;
}) {
  return (
    <div
      role="button"
      data-testid="search-item"
      className="flex items-center border-r-1 hover:shadow-md w-80"
      onClick={() => clickHandler(item)}
    >
      {item.img && (
        <div
          data-testid="item-image"
          className="w-4 h-4 mr-2"
          style={{
            backgroundImage: `url('${item.img}')`,
            backgroundSize: "contain",
          }}
        />
      )}
      <span
        style={{
          textOverflow: "ellipsis",
        }}
        className="cursor-pointer"
      >
        {item.name} (ID: {item.id})
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
  const [closed, setClosed] = useState(true);

  const groupedResults =
    data && data.length > 0
      ? data.reduce((acc, item) => {
          const category = item.id!.startsWith(query)
            ? "ID Matches"
            : item.category;
          (acc[category] = acc[category] || []).push(item as Item);
          return acc;
        }, {} as Record<string, Item[]>)
      : undefined;

  const handleItemClick = (item: Item) => {
    if (
      !searchItems.find(
        (o: { id: string; name: string; category: string }) =>
          o.id === item.id &&
          o.name === item.name &&
          o.category === item.category
      )
    ) {
      dispatch(setSearchItems([...searchItems, item]));
    }
  };

  return (
    <main
      className="z-20 absolute top-20 w-82 bg-white"
      style={{
        left: "8px",
        borderRadius: "8px",
      }}
      id="Search"
    >
      <div
        aria-label="search-toggle"
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
            data-testid="search-label"
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
              data-testid="close-icon"
              className="w-4 mx-2 cursor-pointer"
              onClick={() => setClosed(!closed)}
            />
          )}
        </div>
        <div className={closed ? "hidden" : "inline-block"} data-testid="tag">
          <div className="flex w-80 overflow-x-auto">
            {searchItems.map((item: Item, ix: number) => (
              <Tag
                role="button"
                key={ix}
                text={item.name}
                index={keyList.indexOf(item.category)}
                onClick={() =>
                  dispatch(
                    setSearchItems(
                      searchItems.filter(
                        (clicked: {
                          id: string;
                          name: string;
                          category: string;
                        }) =>
                          clicked.id !== item.id ||
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
            placeholder="Search by name or ID"
          />
          <div data-testid="progress">
            {loading ? (
              <Box mt={1}>
                <Spinner role="progressbar" color="blue.500" />
              </Box>
            ) : query && groupedResults ? (
              <div className="pt-2 h-72 overflow-x-auto cursor-pointer">
                {Object.entries(groupedResults).map(([category, items], ix) => (
                  <div key={ix}>
                    <h1 className="font-bold">{category.toUpperCase()}</h1>
                    {items.map((item: Item, index: number) => (
                      <SearchItem
                        key={index}
                        item={item}
                        clickHandler={handleItemClick}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
