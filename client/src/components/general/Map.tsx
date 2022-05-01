import { MapContainer, TileLayer, Marker } from "react-leaflet";

// Interfaces
import { TransactionLocation } from "../../interfaces/transactions-interface";

interface PropsInterface {
  className: string;
  location: TransactionLocation;
  zoom?: number;
}

function Map(props: PropsInterface) {
  return (
    <MapContainer
      className={props.className}
      center={[props.location.latitude, props.location.longitude]}
      attributionControl={false}
      zoomControl={false}
      zoom={props.zoom ?? 15}
    >
      <TileLayer
        attribution='&copy; "<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors"'
        url={`https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${process.env.REACT_APP_MAP_ACCESS_TOKEN}`}
      />
      <Marker position={[props.location.latitude, props.location.longitude]} />
    </MapContainer>
  );
}

export default Map;
