import './App.css';
import { useEffect, useRef, useState } from 'react'
import style from './components/search/SearchStyles.module.css'
import { CodiconSearch } from './components/pictures/Search';
import { BlockSearch } from './components/search/BlockSearch';


function App() {
  const [open, setOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const openSearch = () => {
    setOpen(true);
  };


  return (
    <div className="App">
      <div className={style.searchContainer} ref={searchContainerRef}>
        <button onClick={openSearch} className={`${style.searchBtnStyle} ${open ? style.active : ''}`}>
          <CodiconSearch></CodiconSearch>
          search
        </button>
        {open && <BlockSearch />}
      </div>
    </div>
  );
}

export default App;
