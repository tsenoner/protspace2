import {useEffect, useState} from "react";
import {Item} from "../../data";
import store from "../../redux/store";

const filter = (query : string) : Promise < Item[] > => {
    const dataItems = store
        .getState()
        .settings
        .dataItems;
    return dataItems !.filter((item : {
        name: string;
    }) => {
        return item
            .name
            .toLowerCase()
            .indexOf(query.toLowerCase()) !== -1;
    });
};

export const getData = (query : string) : Promise < Item[] > => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(filter(query));
        }, 200);
    });
};

interface Output {
    data : null | Item[];
    loading : boolean;
}

const useQuery = ({
    query = ""
} : {
    query: string
}) : Output => {
    const [data,
        setData] = useState < Item[] | null > (null);
    const [loading,
        setLoading] = useState < boolean > (false);

    useEffect(() => {
        setLoading(true);
        getData(query).then((response) => {
            setData(response);
            setLoading(false);
        });
    }, [query]);

    return {data, loading};
};

export default useQuery;