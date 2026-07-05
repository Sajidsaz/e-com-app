import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useLocation } from 'react-router-dom';
import { SearchIcon, CloseIcon } from './ui/Icons';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const [visible, setVisible] = useState(false)
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.includes('collection') && showSearch) {
            setVisible(true)
        }
        else {
            setVisible(false)
        }
    }, [location, showSearch])

    return showSearch && visible ? (
        <div className='border-b border-line bg-cream py-5 text-center'>
            <div className='mx-3 inline-flex w-3/4 items-center justify-center gap-3 rounded-full border border-line bg-white px-5 py-2.5 sm:w-1/2'>
                <SearchIcon className='w-4 h-4 shrink-0 text-ink-soft' />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='flex-1 bg-inherit text-sm outline-none'
                    type='text'
                    placeholder='Search the collection'
                    autoFocus
                />
            </div>
            <button type='button' aria-label='Close search' onClick={() => setShowSearch(false)} className='inline cursor-pointer align-middle text-ink-soft hover:text-ink'>
                <CloseIcon className='w-4 h-4' />
            </button>
        </div>
    ) : null
}

export default SearchBar
