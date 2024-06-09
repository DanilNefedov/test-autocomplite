import { KeyboardEvent, useEffect, useState } from 'react';
import { CodiconStarFull } from '../pictures/FullStar';
import { CodiconSearch } from '../pictures/Search';
import style from './SearchStyles.module.css';
import Fuse from 'fuse.js';
import { VirtualScroll } from './VirtualScroll';

export function BlockSearch() {
    const [openFavorite, setOpenFavorite] = useState(false);
    const [openAll, setOpenAll] = useState(true);


    const [loading, setLoading] = useState(false);
    const [favoriteItem, setFavoriteItem] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const itemHeight = 35;
    const containerHeight = 298;
    const [data, setData] = useState<string[]>([]);
    const [fullData, setFullData] = useState<string[]>([]);
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [visibleData, setVisibleData] = useState<string[]>([]);



    useEffect(() => {
        setLoading(true);
        fetch('https://api-eu.okotoki.com/coins')
            .then(response => response.json())
            .then((data: string[]) => {
                const filteredData = data.filter(item => item.trim() !== '').sort();
                setData(filteredData);
                setFullData(filteredData)
                setFilteredData(filteredData);
                setLoading(false);
                setVisibleData(filteredData.slice(0, Math.ceil(containerHeight / itemHeight)));
            })
            .catch(error => {
                console.error('Error while retrieving data:', error)
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (openFavorite) {
            setData(favoriteItem);
            setFilteredData(favoriteItem);
            setVisibleData(favoriteItem.slice(0, Math.ceil(containerHeight / itemHeight)));
        }
    }, [favoriteItem, openFavorite]);

    useEffect(() => {
        if (openAll) {
            setData(fullData);
            setFilteredData(fullData);
            setVisibleData(fullData.slice(0, Math.ceil(containerHeight / itemHeight)));
        }
    }, [fullData, openAll]);


    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredData(data);
            setVisibleData(data.slice(0, Math.ceil(containerHeight / itemHeight)));
        } else {
            const fuse = new Fuse(data, {
                includeMatches: true,
                threshold: 0.3,
            });
            const result = fuse.search(query).map(({ item }) => item);
            setFilteredData(result);
            setVisibleData(result.slice(0, Math.ceil(containerHeight / itemHeight)));
        }
    };

    const toggleFavorite = () => {
        setOpenFavorite(true);
        setOpenAll(false);
    };

    const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(searchQuery);
        }
    };

    const toggleAll = () => {
        setOpenFavorite(false);
        setOpenAll(true);
    };


    return (
        <div className={style.searchOpenBlock}>
            <div className={style.inputContainer}>
                <input
                    onChange={(e) => handleSearch(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    type="text"
                    className={style.input}
                    placeholder="Search..."
                    value={searchQuery}
                />
                <span className={style.searchIcon}>
                    <CodiconSearch />
                </span>
            </div>
            <hr className={style.border}></hr>
            <div className={style.titleTypes}>
                <div className={style.favorite} onClick={toggleFavorite}>
                    <CodiconStarFull />
                    <p className={`${style.titleSearch} ${style.titleFavorite} ${openFavorite ? style.activeType : ''}`} >
                        Favorite
                    </p>
                </div>
                <p className={`${style.titleSearch} ${openAll ? style.activeType : ''}`} onClick={toggleAll}>
                    All coins
                </p>
            </div>
            {loading ? (
                <p style={{textAlign: "center", marginBottom:'2px'}}>Loading...</p>
            ) : (
               
                <VirtualScroll
                    props={{
                        containerHeight,
                        visibleData,
                        setVisibleData,
                        filteredData,
                        itemHeight,
                        setFavoriteItem,
                        favoriteItem
                    }}
                />
                
            )}
        </div>
    );
};

