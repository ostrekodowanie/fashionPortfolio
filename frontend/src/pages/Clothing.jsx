import { useLocation } from "react-router"
import { useState, useEffect } from "react"
import axios from 'axios'

export default function Clothing() {
    const [clothes, setClothes] = useState([])
    const location = useLocation()

    useEffect(() => {
        let lastPath = location.pathname.split('/').pop()
        axios.get('/clothing/api')
            .then(res => res.data)
            .then(data => lastPath === 'trending' ? data.filter(cloth => cloth.trending) : lastPath === 'new' ? data.filter(cloth => cloth.new) : lastPath === 'collection' ? data.filter(cloth => cloth.collection) : lastPath !== 'clothing' ? data.filter(cloth => cloth.sex === lastPath) : data)
            .then(data => setClothes(data))
            .catch(error => console.log(error.message))
    }, [location]) 

    return (
        <section className="padding-x padding-y">
            <h1 className="font-bold text-2xl">Our {location.pathname === '/clothing/new' ? 'new ' : location.pathname === '/clothing/trending' ? 'trending ' : ''}clothing {location.pathname === "/clothing/men" ? 'for men' : location.pathname === "/clothing/women" ? 'for women' : location.pathname === "/clothing/collection" ? 'collection' : '' }</h1>
            <div className='clothes-wrapper'>
                <div className='clothes-grid grid grid-cols-3 gap-4'>
                    {clothes.map(cloth => <Cloth {...cloth} key={cloth} />)}
                </div>
            </div>
        </section>
    )
}

const Cloth = (props) => {
    return (
        <div>
            <div className='h-[4in] bg-[#BDBDBD]'>
                <img className="max-w-[90%] max-h-[90%]" src={props.image} alt='' />
            </div>
            <h3 className='text-center my-2'>{props.title}</h3>
            {props.sale > 0 ? 
            <>  
                <p className='text-center'><del>${props.price}</del></p>
                <p className='text-center'>${props.price - (props.price * (props.sale / 100))}<strong className='text-red'>{`(-${props.sale}%)`}</strong></p>
            </>
            : <p className='text-center font-bold'>${props.price}</p>}
        </div>
    )
}