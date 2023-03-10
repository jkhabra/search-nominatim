import "./style.css";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Loader from "../Loader";

dayjs.extend(relativeTime);
export interface ListingItemProps {
  id: string;
  title: string;
  date?: any;
}

interface ListingProps {
  isActive: boolean;
  isLoading?: boolean;
  itemId?: any;
  type?: string;
  isFetching?: boolean;
  onAction: Function;
  items: ListingItemProps[];
}

const Listing = (p: ListingProps) => {
  if (p.isActive) {
    return null;
  }

  if (p.isLoading) {
    return (
      <div className="no-item">
        <Loader />
      </div>
    );
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
        <div
          key={i.id}
          className={`list-resutl ${i.id === p.itemId && "active"}`}
          onClick={() => p.onAction(i)}
        >
          <span>{i.title}</span>
          {i.date && (
            <span className="res-time">{` ${dayjs(i.date).fromNow()}`}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Listing;
