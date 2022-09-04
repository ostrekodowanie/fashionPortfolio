import { Link, useResolvedPath, useMatch, useLocation } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import { cartImg, profile, heart, searchImg } from '../assets/navbar'
import { useDispatch, useSelector } from 'react-redux/es/exports'
import { add } from '../reducers/cart'
import axios from 'axios'

const pages = [
    'Women',
    'Men',
    'Collection',
    'Trending',
    'New'
]

export default function Header() {
    const [nav, setNav] = useState(false)
    const { cart } = useSelector(state => state.cart)
    const location = useLocation()
    const [quantity, setQuantity] = useState(0)
    const [search, setSearch] = useState({
        active: false,
        items: [],
        filtered: [],
        input: ''
    })

    const disableNav = () => setNav(false)

    const NavLink = ({children, path }) => {
        const activePath = useResolvedPath(path)
        const isActive = useMatch({ path: `${activePath.pathname}/*`, end: true })
        return <Link className={isActive ? 'active' : 'hover:text-darkPrimary'} to={path} onClick={disableNav}>{children}</Link>
    }

    useEffect(() => {
        setSearch({...search, active: false})
    }, [location])

    useEffect(() => {
        let q = 0;
        cart.forEach(item => q += item.quantity)
        setQuantity(q)
    }, [cart])

    const handleSearch = useCallback(() => {
        setSearch({...search, active: !search.active, input: ''})
        axios.get('/clothing/api')
            .then(res => res.data)
            .then(items => setSearch({...search, active: !search.active, items: items, filtered: items, input: ''}))
    })

    const handleInput = e => {
        let filter = search.items.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()))
        setSearch({...search, filtered: filter, input: e.target.value})
    }

    return (
        <header className='flex justify-between items-center min-h-[5rem] bg-white padding-x shadow-md fixed top-0 right-0 left-0 z-10'>
            <div className='logo font-medium'>
                <Link to='/' onClick={disableNav}>fashionPortfolio.</Link>
            </div>
            <nav className={`navbar flex gap-6 2xl:gap-10 absolute top-0 left-[100%] lg:h-full lg:relative lg:justify-end lg:flex-row lg:left-auto lg:transform-none lg:opacity-100 h-screen w-screen bg-white items-center flex-col opacity-0 justify-center ${nav ? '-translate-x-full opacity-100' : ''} transition duration-500`}>
                {pages.map(page => <NavLink className='hover:text-[darkPrimary]' key={page} path={`/clothing/${page.toLowerCase()}`}>{page}</NavLink>)}
                <NavLink path='/contact'>Contact us</NavLink>
                <div className='flex items-center gap-4 mt-4 lg:ml-4 lg:mt-0 2xl:gap-6 xl:ml-[8vw] relative'>
                    <a onClick={handleSearch}><img src={searchImg} alt='search' /></a>
                    <NavLink path='/profile/favourite'><img src={heart} alt='favourite' /></NavLink>
                    <NavLink path='/profile'><img src={profile} alt='profile' /></NavLink>
                    <NavLink path='/cart'>
                        <img src={cartImg} alt="cart" />
                        {quantity > 0 ? <div className='rounded-[50%] flex justify-center items-center bg-darkPrimary absolute h-[1.2rem] w-[1.2rem] text-sm bottom-[-4px] right-[-4px] text-white'>{quantity}</div> : <></>}
                    </NavLink>
                </div>
            </nav>
            <div className='burger flex flex-col relative lg:hidden h-5 w-7 justify-between cursor-pointer' onClick={() => setNav(prev => !prev)}>
                <div style={nav ? {position: 'absolute', top: '50%', transform: 'translateY(-50%) rotate(45deg)'} : {}} className={lineStyle}></div>
                <div style={nav ? {display: 'none'} : {}} className={lineStyle}></div>
                <div style={nav ? {position: 'absolute', top: '50%', transform: 'translateY(-50%) rotate(-45deg)'} : {}} className={lineStyle}></div>
            </div>
            <div className={`${search.active ? '' : 'hidden'} absolute translate-y-[100%] bottom-0 right-[14vw]`}>
                <input onChange={handleInput} className='border-t-[1px] border-x-[1px] border-black px-4 py-2 rounded-sm' type='text' placeholder='Search for clothes' />
                <div className={`list flex flex-col border-[1px] border-black max-h-[6rem] overflow-auto ${search.active ? '' : 'hidden'}`}>
                    {search.filtered.map(cloth => <SearchItem key={cloth} {...cloth} cloth={cloth} />)}
                </div>
            </div>
        </header>
    )
}

const lineStyle = 'h-[2px] w-full bg-black transition-transform'

const SearchItem = props => {
    const dispatch = useDispatch()

    return (
        <div onClick={() => dispatch(add({...props.cloth, quantity: 1}))} className='cursor-pointer p-2 flex gap-2 bg-white'>
            <div className='h-[2rem] w-[2rem] bg-[#BDBDBD] flex justify-center items-center'>
                <img className="max-w-[90%] max-h-[90%]" src={props.image} alt='' />
            </div>
            <h3>{props.title}</h3>
            {props.sale ? <strong>${props.sale ? props.price - (props.price * (props.sale / 100)) : props.price} <span className="text-red-500">{`-(${props.sale}%)`}</span></strong> : <strong>${props.price}</strong>}
        </div>
    )
}