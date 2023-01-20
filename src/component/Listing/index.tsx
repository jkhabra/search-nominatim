import "./style.css";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
export interface ListingItemProps {
  id: string;
  title: string;
  date?: any;
}

interface ListingProps {
  title: string;
  type?: string;
  isFetching?: boolean;
  onAction: Function;
  items: ListingItemProps[];
}

const Listing = (p: ListingProps) => {
  if (!p.items) {
    return <span>No items</span>;
  }

  return (
    <div className="list-container">
      <span>{p.title}</span>

      {p.items.map((i) => (
        <div key={i.id} className="search-resutl" onClick={() => p.onAction(i)}>
          <span>{i.title}</span>
          {i.date && <span>{dayjs(i.date).fromNow()}</span>}
        </div>
      ))}
    </div>
  );
};

export default Listing;
