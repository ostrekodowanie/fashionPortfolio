import { useLocation, useNavigate } from "react-router"
import { useSelector } from 'react-redux/es/exports'
import { useState, useEffect, useRef } from "react"
import axios from 'axios'
import { Link } from "react-router-dom"
import SearchBar from "../components/SearchBar"
import sale from '../assets/sale.svg'
import arrow from '../assets/arrow-down.svg'
import clear from '../assets/x.svg'
import Loader from "../components/Loader"
import { ReactComponent as Save } from '../assets/save.svg'

const filters = [
    'Jackets',
    'Shoes',
    'Tshirts',
    'Hoodies',
    'Trousers'
]

const sorts = {
    price: ['Ascending', 'Descending']
}

export default function Clothing() {
    const [clothes, setClothes] = useState([])
    const [sort, setSort] = useState({
        price: ''
    })
    const [filtered, setFiltered] = useState({
        filter: '',
        clothes: []
    })
    const [saved, setSaved] = useState([])
    const { id } = useSelector(state => state.login.info)

    const location = useLocation()

    // sorting logic

    useEffect(() => {
        if(sort.price === 'Ascending') filtered.clothes.length === 0 ? setFiltered({...filtered, clothes: clothes.sort((a, b) => a.price - b.price)}) : setFiltered({...filtered, clothes: filtered.clothes.sort((a, b) => a.price - b.price)})
        if(sort.price === 'Descending') filtered.clothes.length === 0 ? setFiltered({...filtered, clothes: clothes.sort((a, b) => b.price - a.price)}) : setFiltered({...filtered, clothes: filtered.clothes.sort((a, b) => b.price - a.price)})
    }, [sort])

    // fetching api

    useEffect(() => {
        setClothes([])
        setFiltered({ filter: '', clothes: [] })
        setSort({
            price: ''
        })
        let lastPath = location.pathname.split('/').pop()
        axios.get('/clothing/api')
            .then(res => res.data)
            .then(data => lastPath === 'trending' ? data.filter(cloth => cloth.trending) : lastPath === 'new' ? data.filter(cloth => cloth.new) : lastPath === 'collection' ? data.filter(cloth => cloth.collection) : lastPath !== 'clothing' ? data.filter(cloth => cloth.sex === lastPath) : data)
            .then(data => setClothes(data))
            .catch(error => console.log(error.message));
    }, [location])

    useEffect(() => {
        if(typeof(id) === "number") {
            axios.post('/api/favourites/id', JSON.stringify({user_id: id}), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.data)
            .then(data => data.map(save => save.clothing_id))
            .then(ids => setSaved(ids))
        }
    }, [id, location])

    // filter

    const AsideFilter = () => {
        return (
            <aside className="hidden md:block bg-white shadow-outsideBlueLg p-8 rounded-md">
                <h2 className="text-2xl font-bold mb-8">Filters</h2>
                <nav className="flex flex-col gap-4 mb-8">
                    {filters.map(filter => <a className={`${filtered.filter === filter ? 'text-primary font-bold' : 'hover:text-primary'} cursor-pointer`} key={filter} onClick={() => setFiltered({filter: filter, clothes: clothes.filter(cloth => cloth.type === filter.toLowerCase())})}>{filter}</a>)}
                </nav>
                <a className="text-primary cursor-pointer font-medium flex items-center" onClick={() => setFiltered({clothes: [], filter: ''})}><img className="max-h-[1em] mr-2" src={clear} alt='x' />Clear</a>
            </aside>
        )
    }

    // sorter

    const Sort = () => {
        const [active, setActive] = useState(false)
        const Arrow = () => <img className={`${active ? 'rotate-90' : ''} transition-all ml-2`} src={arrow} alt="" />
        return ( 
            <div className="relative">
                <h3 className="font-bold cursor-pointer flex items-center" onClick={() => setActive(prev => !prev)}>Sort by <Arrow /></h3>
                {active ? <div className='absolute left-0 lg:left-auto lg:right-0 mt-2 rounded p-4 flex flex-col bg-white gap-4 border-[1px] border-[#E6E6E6]'>
                    <h4 className="font-bold">Price</h4>
                    <ul className="text-[#8B8B8B] flex flex-col font-medium gap-1">
                        {sorts.price.map(price => <li className={`cursor-pointer transition ${sort.price === price ? 'text-primary font-bold' : 'hover:text-primary text-[#979797]'}`} key={price} onClick={() => setSort({...sort, price: price})}>{price}</li>)}
                    </ul>
                </div> : <></>}
            </div>
        )
    }

    return (
        <section className="padding-x pt-[1.3in] md:pt-[1.8in] min-h-screen flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-0 relative z-10">
                <h1 className="font-bold text-4xl lg:text-5xl first-letter:capitalize">{location.pathname.split("/").pop()}</h1>
                <SearchBar />
                <Sort />
            </div>
            <div className='md:grid-cols-clothes md:grid md:flex-grow mt-8 md:mt-20'>
                <AsideFilter />
                <div className='clothes-grid flex flex-col gap-8 md:grid grid-cols-mobileAutoFit min-h-[3in] md:grid-cols-autoFit md:ml-8 p-8 bg-white shadow-outsideBlueLg rounded-md'>
                    {clothes.length === 0 || filtered.clothes === 0 ?  <Loader /> : <></>}
                    {filtered.clothes.length === 0 ? clothes.map(cloth => <Cloth {...cloth} key={cloth} fav={saved} cloth={cloth} />) :
                    filtered.clothes.map(cloth => <Cloth {...cloth} key={cloth} fav={saved} cloth={cloth} />)}
                </div>
            </div>
        </section>
    )
}

const Cloth = (props) => {
    const navigate = useNavigate()
    const login = useSelector(state => state.login)
    const { logged } = login
    const { id } = login.info
    const [saved, setSaved] = useState(props.fav.includes(props.id) ? true : false)
    const firstUpdate = useRef(true)

    const handleAdd = async () => {
        await axios.post('/api/favourites', JSON.stringify({
            user_id: id,
            clothing_id: props.id
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const handleRemove = async () => {
        let removeId;
        try {
            await axios.get('/api/favourites')
                .then(res => res.data)
                .then(data => data.filter(save => save.user_id === id && save.clothing_id === props.id))
                .then(save => removeId = save[0].id)
        }
        catch {
            return setSaved(true)
        }
        axios.delete(`/api/favourites/remove/${removeId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    useEffect(() => {
        if(!firstUpdate.current) {
            if(!logged) return navigate('/login')
            if(saved) handleAdd()
            if(!saved) handleRemove()
        }
        firstUpdate.current = false
    }, [saved])

    return (
        <div className="relative">
            <Link className='block relative no-underline' to={`/clothing/${props.id}`}>
                {props.sale ? <img className="absolute max-w-[3rem] left-3 top-3" src={sale} alt="sale" /> : <></> }
                <div className='h-[4in] md:h-[4.5in] bg-[#FBFBFB] rounded-xl shadow-outsideBlueSm flex justify-center items-center'>
                    <img className="max-w-[90%] max-h-[90%]" src={`/images/${props.image.split('/').pop()}`} alt='' />
                </div>
                <h3 className='text-center font-medium text-xl mt-4 mb-1'>{props.title}</h3>
                {props.sale > 0 ? 
                <>  
                    <p className='text-center'><del>${props.price}</del></p>
                    <p className='text-center'><strong className="text-primary">${props.price - (props.price * (props.sale / 100))} <strong className='text-red-500'>{`(-${props.sale}%)`}</strong></strong></p>
                </>
                : <p className='text-center text-primary font-bold'>${props.price}</p>}
            </Link>
            <Save onClick={() => setSaved(prev => !prev)} className="absolute top-[4.8in] cursor-pointer left-6 max-h-8 max-w-8 z-10" fill={saved ? 'red' : 'white'} alt="Save" />
        </div>

    )
}