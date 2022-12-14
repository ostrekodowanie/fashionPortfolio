import { useState, useRef, useEffect } from "react"
import x from '../assets/x.svg'
import { Link } from "react-router-dom"
import axios from "axios"

export default function SearchBar() {
    const input = useRef()
    const [search, setSearch] = useState({
        active: false,
        items: [],
        filtered: [],
        input: ''
    })

    useEffect(() => {
        if(search.active) {
            axios.get('/clothing/api')
                .then(res => res.data)
                .then(items => search.filtered.length === 0 ? setSearch({...search, items: items, filtered: items}) : setSearch({...search, items: items}))
        }
    }, [search.active])

    const handleInput = e => {
        let filter = search.items.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()))
        setSearch({...search, filtered: filter, input: e.target.value})
    }

    const handleBlur = () => {
        setTimeout(() => {
            setSearch({...search, active: false, input: ''})
        }, 200)
    }

    return (
        <div className="relative z-10">
            <div className="relative max-w-[max-content]">
                <input ref={input} value={search.input} onFocus={() => setSearch({...search, active: true})} onBlur={handleBlur} onChange={handleInput} style={{backgroundPosition: '1.5rem center', backgroundSize: '1em'}} className='relative font-medium peer placeholder:font-normal w-full lg:w-auto bg-search bg-no-repeat shadow-outsideBlueSm outline-none bg-white px-16 py-2 pr-[6vw] rounded-md' type='text' />
                <span className="absolute pointer-events-none peer-focus:translate-y-[-62%] peer-focus:left-14 peer-focus:text-sm peer-focus:px-4 transition-all duration-300 translate-y-[50%] bottom-[50%] text-[1em] left-16 text-[#989898]">Search for clothes</span>
                {search.input.split("").length > 0 ? <img onClick={() => setSearch({...search, input: ''})} className="absolute cursor-pointer right-[1.5rem] translate-y-[50%] bottom-[50%] max-h-[1em]" src={x} alt="" /> : <></>}
            </div>
            {search.active ? <div className='absolute right-0 left-0 mt-2 flex flex-col max-h-[1.2in] overflow-auto'>
                {search.filtered.map(cloth => <SearchItem key={cloth} {...cloth} cloth={cloth} />)}
            </div> : <></> }
        </div>
    )
}

const SearchItem = props => {
    return (
        <Link to={`/clothing/${props.id}`} className='cursor-pointer py-3 px-6 rounded flex gap-4 bg-white border-[1px] border-[#E6E6E6] odd:bg-[#FAFAFA]'>
            <div className='h-[2rem] w-[2rem] bg-[#F2F2F2] flex justify-center items-center'>
                <img className="max-w-[2rem] max-h-[2rem]" src={props.image} alt='' />
            </div>
            <h3>{props.title}</h3>
            {props.sale ? <strong>${props.sale ? props.price - (props.price * (props.sale / 100)) : props.price} <span className="text-red-500">{`-(${props.sale}%)`}</span></strong> : <strong>${props.price}</strong>}
        </Link>
    )
}