import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Listing from "../Listing";
import RanderMap from "../maps";
import "./style.css";

interface SearchProps {
  display_name: string;
  extratags: { population: string; "census:population": string; place: string };
  lat: string;
  lon: string;
  place_id: number | string;
  osm_id: number;
}

const url = "https://nominatim.openstreetmap.org/search?";
const fetchLocation = async (p: { query: string }) => {
  try {
    const res = await fetch(
      `${url}q=${p.query}&format=json&extratags=1&addressdetails=1`
    );
    const data = await res.json();
    if (res.status === 200 && data) {
      console.log("----da", data);
      return data;
    }
    return [];
  } catch (err) {
    console.log("--err--", err);
  }
};

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("Boston MA");
  const [tempQuery, setTempQuery] = useState<string>(""); //temp save the query
  const [serchRes, setSearchRes] = useState<SearchProps[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [cods, setCods] = useState<SearchProps | {}>({});

  const getQueryString = (q: { name: string }) => {
    return searchParams.get(q.name);
  };
  const placeName = getQueryString({ name: "place" });
  const palceId = getQueryString({ name: "id" });

  useEffect(() => {
    (async () => {
      let data = [];
      if (placeName && palceId) {
        data = await fetchLocation({ query: placeName });
        setSearchQuery(placeName);
        setTempQuery(placeName);
      } else {
        data = await fetchLocation({ query: searchQuery });
      }

      if (data) {
        setSearchRes(data);
        if (palceId) {
          const item = data.find(
            (i: SearchProps) => i.place_id === parseInt(palceId)
          );
          setCods(item);
          return;
        }
        setCods(data[0]);
      }
    })();
  }, []);

  const findResult = async (query?: string) => {
    const data = await fetchLocation({ query: query || searchQuery });
    if (data) {
      setSearchHistory([...searchHistory, searchQuery]);
      setTempQuery(searchQuery);
      setSearchRes(data);
      if (query) {
        setSearchQuery(query);
      }
    }
  };

  const showInMap = (item: any) => {
    console.log("--itme--", item);
    setCods(item);
  };

  const handleShare = () => {
    const copyText = `${window.location.origin}?id=${cods.place_id}&place=${tempQuery}`;
    setSearchParams({ id: cods.place_id, place: tempQuery });

    // copy to clipboard
    navigator.clipboard.writeText(copyText);
  };

  const resutls = serchRes.map((i: any) => {
    return { id: i.place_id, title: i.display_name };
  });
  const history = searchHistory.map((i: any) => {
    return { id: JSON.stringify(Math.random()), title: i };
  });

  return (
    <>
      <div className="container">
        <div className="search-container">
          <span>Search Place</span>
          <div className="search-body">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button onClick={() => findResult()} disabled={!searchQuery.length}>
              Search
            </button>
          </div>
        </div>

        <Listing title="Search Result" onAction={showInMap} items={resutls} />

        <div className="location-details">
          <span>Population: {cods?.extratags?.population || "NA"}</span>
          <span>
            Year: {cods?.extratags ? cods.extratags["census:population"] : "NA"}
          </span>
        </div>

        <RanderMap cod={[cods?.lat, cods?.lon]} />

        <div className="search-history">
          <Listing
            type="findResult"
            title="Search History"
            onAction={findResult}
            items={history}
          />
        </div>

        <button onClick={handleShare}>Share</button>
      </div>
    </>
  );
};

export default Dashboard;
