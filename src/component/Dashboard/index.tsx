import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import RanderMap from "../maps";

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
    console.log("----da", data);
    return data;
  } catch (err) {
    console.log("--err--", err);
  }
};

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("Boston MA");
  const [serchRes, setSearchRes] = useState<SearchProps[]>([]);
  const [cods, setCods] = useState<SearchProps | {}>({});

  const getQueryString = (q: { name: string }) => {
    return searchParams.get(q.name);
  };
  const placeName = getQueryString({ name: "query" });
  const palceId = getQueryString({ name: "id" });

  useEffect(() => {
    (async () => {
      let data = [];
      if (placeName && palceId) {
        data = await fetchLocation({ query: placeName });
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

  const findResult = async () => {
    const data = await fetchLocation({ query: searchQuery });
    if (data) {
      setSearchRes(data);
    }
  };

  const showInMap = (item: any) => {
    console.log("--itme--", item);
    setCods(item);
  };

  const handleShare = () => {
    console.log("--copy--");
    navigator.clipboard.writeText("copy text");
  };

  return (
    <>
      <input onChange={(e) => setSearchQuery(e.target.value)} />
      {serchRes.map((i: { display_name: string }) => (
        <div
          key={i.osm_id}
          className="search-resutl"
          onClick={() => showInMap(i)}
        >
          <span>{i.display_name}</span>
        </div>
      ))}
      <button onClick={findResult}>Search</button>
      <div className="location-details">
        <span>Population: {cods?.extratags?.population || "NA"}</span>
        <span>
          Year: {cods?.extratags ? cods.extratags["census:population"] : "NA"}
        </span>
      </div>
      <RanderMap cod={[cods?.lat, cods?.lon]} />

      <button onClick={handleShare}>Share</button>
    </>
  );
};

export default Dashboard;
