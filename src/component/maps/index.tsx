interface mapProps {
  cod: any| []
}

const s = '30.8703853, 30.9103853, 76.520128, 76.560128';

const RanderMap = (p: mapProps) => {
  return (
    <>
      <iframe
        src={`http://maps.google.com/maps?q=${p.cod}&z=15&output=embed`}
        className='map'
      ></iframe>
    </>
  );
};

export default RanderMap;
