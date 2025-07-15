import { useState } from 'react';

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions);

  const liStyle = 'text-xs md:text-sm lg:text-base font-mono px-2 py-1';

  return (
    <div className="absolute w-full z-10 top-2 h-10 pointer-events-none flex justify-center items-center">
      <ul className="flex flex-row justify-center h-full items-center bg-gray-800 text-white rounded-full opacity-60 px-2">
        <li className={liStyle}>Electron v{versions.electron}</li>
        <li className={liStyle}>Chromium v{versions.chrome}</li>
        <li className={liStyle}>Node v{versions.node}</li>
      </ul>
    </div>
  );
}

export default Versions;
