import style from './SearchStyles.module.css';
import { useRef, useCallback, Dispatch } from 'react';
import { CodiconStarFull } from '../pictures/FullStar';
import { CodiconStarEmpty } from '../pictures/EmptyStar';



interface dataProps {
  itemHeight: number,
  containerHeight: number,
  filteredData: string[],
  setFavoriteItem: Dispatch<React.SetStateAction<string[]>>,
  favoriteItem: string[],
  visibleData: string[],
  setVisibleData: Dispatch<React.SetStateAction<string[]>>

}

export function VirtualScroll({ props }: { props: dataProps }) {
  const { containerHeight, visibleData, setVisibleData, filteredData, itemHeight, setFavoriteItem, favoriteItem } = props
  const containerRef = useRef<HTMLDivElement | null>(null);


  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const startIndex = Math.floor(scrollTop / itemHeight);
      const endIndex = startIndex + Math.ceil(containerHeight / itemHeight);
      setVisibleData(filteredData.slice(startIndex, endIndex));
    }
  }, [filteredData]);

  function handleFavorite(item: string) {
    if (!favoriteItem.includes(item)) {
      setFavoriteItem([...favoriteItem, item].sort());
    } else {
      setFavoriteItem(favoriteItem.filter(favorite => favorite !== item));
    }
  }

  return (
    <div ref={containerRef}
      onScroll={handleScroll}
      style={{ height: containerHeight, overflowY: 'auto', position: 'relative' }}
      className={`${style.containerScroll}`}
    >

      <div style={{ height: filteredData.length * itemHeight, position: 'relative' }} className={style.blockScroll}>
        {visibleData.map((item) => {
          const itemIndex = filteredData.indexOf(item);
          return (
            <div
              key={itemIndex}
              style={{
                position: 'absolute',
                top: itemIndex * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
              className={style.itemScroll}
            >
              {favoriteItem.includes(item) ? (
                <span onClick={() => handleFavorite(item)} style={{ marginTop: " 4px" }}>
                  <CodiconStarFull></CodiconStarFull>
                </span>
              ) : (
                <span onClick={() => handleFavorite(item)} style={{ marginTop: "4px" }}>
                  <CodiconStarEmpty></CodiconStarEmpty>
                </span>
              )}

              <p style={{ marginLeft: '10px' }}>{item}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};


