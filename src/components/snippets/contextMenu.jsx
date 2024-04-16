const ContextMenu = ({ x, y, onClose, onCopyNextDay, onCopyPreviousDay }) => {
    return (
      <div
        style={{
          top: y,
          left: x,
         
        }}
        className="absolute  text-black shadow shadow-white rounded  grid "
      >
        <button className="border-b p-2 text-left hover:bg-gray-200 bg-gray-100" onClick={onCopyNextDay}>Copy Event to Next Day</button>
        <button className="border-b p-2 text-left hover:bg-gray-200 bg-gray-100" onClick={onCopyPreviousDay}>Copy Event to Previous Day</button>
        <button className="border-b p-2 text-left hover:bg-gray-200 bg-gray-100" onClick={onClose}>Cancel</button>
      </div>
    );
  };
  export default ContextMenu