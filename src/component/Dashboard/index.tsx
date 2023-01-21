import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import Listing from "../Listing";
import RanderMap from "../maps";
import Loader from "../Loader";

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
const fetchLocation = async (p: { query: string, setLoading: Function }) => {
  try {
    p.setLoading(true);
    const res = await fetch(
      `${url}q=${p.query}&format=json&extratags=1&addressdetails=1&limit=8`
    );
    const data = await res.json();
    if (res.status === 200 && data) {
      //console.log("----da", data);
      p.setLoading(false);
      return data;
    }
    p.setLoading(false);
    return [];
  } catch (err) {
    console.log("--err--", err);
  }
};

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("Boston MA");
  const [activeTile, setActiveTile] = useState<0 | 1>(0);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [tempQuery, setTempQuery] = useState<string>(""); //temp save the query
  const [serchRes, setSearchRes] = useState<SearchProps[]>([]);
  const [searchHistory, setSearchHistory] = useState<
    { id: string; title: string; date: any }[]
  >([]);
  const [cods, setCods] = useState<SearchProps>();

  const getQueryString = (q: { name: string }) => {
    return searchParams.get(q.name);
  };
  const placeName = getQueryString({ name: "place" });
  const palceId = getQueryString({ name: "id" });

  useEffect(() => {
    (async () => {
      let data = [];
      if (placeName && palceId) {
        data = await fetchLocation({ query: placeName, setLoading });
        setSearchQuery(placeName);
        setTempQuery(placeName);
      } else {
        data = await fetchLocation({ query: searchQuery, setLoading });
        setTempQuery(searchQuery);
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

  const findResult = async (q: { title: string }) => {
    const str: string = q.title;
    const data = await fetchLocation({ query: str, setLoading });
    if (data) {
      // for to keep unique (history) values [...new Set([...searchHistory, str])]
      setSearchHistory([
        { id: JSON.stringify(Math.random()), title: str, date: dayjs() },
        ...searchHistory,
      ]);
      setTempQuery(str);
      setSearchQuery(str);
      setSearchRes(data);
    }
  };

  const showInMap = (item: any) => {
    //console.log('---item---', item)
    setCods(item);
  };

  const handleShare = () => {
    const copyText = `${window.location.origin}?id=${cods?.place_id}&place=${tempQuery}`;
    if (cods?.place_id) {
      setSearchParams({ id: JSON.stringify(cods.place_id), place: tempQuery });
    }
    // copy to clipboard
    navigator.clipboard.writeText(copyText);
  };

  const handleEnterPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await findResult({ title: searchQuery });
    }
  };

  const resutls = serchRes.map((i: any) => {
    return { ...i, id: i.place_id, title: i.display_name };
  });

  return (
    <>
      <div className="container">
        <h2>Find any place!</h2>
        <div className="search-container">
          <h5 className={`list-title active`}>Search a Place</h5>
          <div className="search-body">
            <input
              className="search-input"
              value={searchQuery}
              onKeyDown={handleEnterPress}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button
              className={`${
                !searchQuery.length && "btn-disable"
              } search-button`}
              onClick={() => findResult({ title: searchQuery })}
            >
              Search
            </button>

            <button className={`search-button`} onClick={handleShare}>
              Share
            </button>
          </div>
        </div>

        <div className="sec-container">
          <h5
            onClick={() => setActiveTile(0)}
            className={`${!activeTile && "active"} list-title`}
          >
            Search Result
          </h5>
          <h5
            onClick={() => setActiveTile(1)}
            className={`${activeTile && "active"} list-title`}
          >
            Search History
          </h5>
        </div>

        <Listing
          itemId={cods?.place_id}
          isLoading={isLoading}
          isActive={activeTile === 1}
          onAction={showInMap}
          items={resutls}
        />
        <Listing
          isActive={activeTile === 0}
          onAction={findResult}
          items={searchHistory}
        />

        <div className="detail-wrapper">
          <h5 className={`list-title active`}>Result Deatils</h5>

          <div className="location-details">
            {isLoading && <Loader />}
            <span>{`Population: ${cods?.extratags?.population || "NA"}`}</span>
            <span>
              {`Year:  ${cods?.extratags["census:population"] || "NA"}`}
            </span>
          </div>
        </div>

        <div className="detail-wrapper">
          <h5 className={`list-title active`}>Map</h5>
          <div className="map-wrapper">
            <RanderMap cod={[cods?.lat, cods?.lon]} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
