interface ListCardProps {
  title: string;
  items: string[];
}

function ListCard({ title, items }: ListCardProps) {
  return (
    <>
      <div className="card bg-base-100 h-full flex flex-col">
        <div className="card-body flex-grow">
          <div className="card-title">{title}</div>
          <ul className="list-disc ml-5 py-4">
            {items.length > 0 ? (
              items.map((item, idx) => (
                <li key={idx} className="opacity-60">
                  {item}
                </li>
              ))
            ) : (
              <li className="opacity-60">None</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ListCard;
