import Loader from "../Loader";
interface mapProps {
  isLoading: boolean;
  cod: any | [];
}

const RanderMap = (p: mapProps) => {
  if (p.isLoading) {
    return (
      <div className="map-load no-item">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <iframe
        src={`http://maps.google.com/maps?q=${p.cod}&z=15&output=embed`}
        className="map"
      ></iframe>
    </>
  );
};

export default RanderMap;
