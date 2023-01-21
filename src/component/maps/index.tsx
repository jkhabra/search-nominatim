import GoogleMapReact from "google-map-react";
// @ts-ignore
import Loader from "../Loader";
import "./style.css";

const Marker = (props: { text: string; lat: number; lng: number }) => {
  return <div className="marker">{props.text}</div>;
};
interface mapProps {
  isLoading: boolean;
  cod: any;
  zoom: number;
}

const RanderMap = (p: mapProps) => {
  if (p.isLoading) {
    return (
      <div className="map-load no-item">
        <Loader />
      </div>
    );
  }
  if (!p.cod?.lat) {
    return null;
  }

  const center = [parseInt(p.cod.lat), parseInt(p.cod.lon)];
  return (
    <>
      {/* <iframe
        src={`http://maps.google.com/maps?q=${p.cod}&z=15&output=embed`}
        className="map"
      ></iframe> */}
      <div className="map">
        <GoogleMapReact
          bootstrapURLKeys={{ key: "" }}
          defaultCenter={{ lat: 42.3554334, lng: -71.060511 }}
          // @ts-ignore
          center={center}
          zoom={p.zoom}
        >
          <Marker lat={p.cod.lat} lng={p.cod.lon} text={"M"} />
        </GoogleMapReact>
      </div>
    </>
  );
};

export default RanderMap;
