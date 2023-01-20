import "./style.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export interface ListingItemProps {
  id: string;
  title: string;
  date?: any;
}

interface ListingProps {
  isActive: boolean;
  type?: string;
  isFetching?: boolean;
  onAction: Function;
  items: ListingItemProps[];
}

const Listing = (p: ListingProps) => {
  if (p.isActive) {
    return null;
  }

  if (!p.items?.length) {
    return (
      <div className="no-item">
        <span>No data found</span>
      </div>
    );
  }

  return (
    <div className="list-container">
      {p.items.map((i) => (
        <div key={i.id} className="list-resutl" onClick={() => p.onAction(i)}>
          <span>{i.title}</span>
          {i.date && <span>{dayjs(i.date).fromNow()}</span>}
        </div>
      ))}
    </div>
  );
};

export default Listing;
