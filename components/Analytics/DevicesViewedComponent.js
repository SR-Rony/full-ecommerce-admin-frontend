
const DevicesViewedComponent = ({ devices }) => {
  return (
    <div className="flex space-x-4">
      {devices.map((device) => (
        <div key={device.id} className="flex-shrink-0">
          <img src={device.image} alt={device.name} className="w-16 h-16 object-cover rounded-full" />
          <p className="text-xs">{device.name}</p>
        </div>
      ))}
    </div>
  );
};

export default DevicesViewedComponent;
