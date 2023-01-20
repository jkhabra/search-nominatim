import "./style.css";

export interface ListingItemProps {
  id: string;
  title: string;
}

interface ListingProps {
  title: string;
  type?:string;
  isFetching?: boolean;
  onAction: Function;
  items: ListingItemProps[];
}

const Listing = (p: ListingProps) => {
  if(!p.items) {
      return <span>No items</span>
  }

  const onAction = (i:ListingItemProps) => {
    if(p.type === 'findResult'){
      p.onAction(i.title);
      return;
    }
    p.onAction(i)
  }

  return (
    <div className="list-container">
      <span>{p.title}</span>

      {p.items.map((i) => (
        <div key={i.id} className="search-resutl" onClick={() => onAction(i)}>
          <span>{i.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Listing;
