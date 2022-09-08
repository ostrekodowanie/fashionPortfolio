import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { add, remove } from "../reducers/cart"

export default function Cart() {
    const { cart } = useSelector(state => state.cart)
    const [items, setItems] = useState([])
    const [summary, setSummary] = useState(0)

    useEffect(() => {
        setItems(cart)
    }, [cart])

    useEffect(() => {
        let summaryPrice = 0;
        items.forEach(cloth => {
            let item = cart.find(item => item.id === cloth.id)
            if(cloth.sale) {
                summaryPrice += (cloth.price - (cloth.price * (cloth.sale / 100))) * item.quantity
            } else {
                summaryPrice += cloth.price * item.quantity
            }
        })
        setSummary(summaryPrice)
    }, [items])

    return (
        <div className="cart flex flex-col lg:max-w-[max-content]">
            {items.map(cloth => <CartItem {...cloth} cart={cart} cloth={cloth} key={cloth} />)}
            { summary > 0 ? 
            <div className="summary grid grid-cols-2 grid-rows-2 border-[#BDBDBD] border-t-2">
                <h2 className="text-xl font-bold pt-8">Total</h2>
                <strong className="text-2xl col-first">${summary}</strong>
                <a className="row-span col-second self-center ml-auto bg-primary text-white text-lg font-bold w-[max-content] py-2 px-6" path='/profile/buy'>Proceed payment</a>
            </div> : <p>Nothing's there! Go ahead and <Link className='text-primary font-bold' to='/clothing'>choose some clothing.</Link></p>
            }
        </div>
    )
}

const CartItem = props => {
    const dispatch = useDispatch()

    const index = props.cart.findIndex(item => item.id === props.id)

    return (
        <div className="p-4 flex gap-6 border-t-2 border-[#BDBDBD]">
            <div className='h-[3rem] w-[3rem] bg-[#BDBDBD] flex justify-center items-center'>
                <img className="max-w-[90%] max-h-[90%]" src={props.image} alt='' />
            </div>
            <h3>{props.title}</h3>
            {props.sale ? <strong>${props.sale ? props.price - (props.price * (props.sale / 100)) : props.price} <span className="text-red-500">{`-(${props.sale}%)`}</span></strong> : <strong>${props.price}</strong>}
            <button onClick={() => {dispatch(remove(props.cloth))}} className="rounded-[50%] h-8 w-8 text-xl border-black border-[1px] bg-transparent flex justify-center items-center my-auto">-</button>
            <button onClick={() => {dispatch(add(props.cloth))}} className="rounded-[50%] h-8 w-8 text-xl border-black border-[1px] bg-transparent flex justify-center items-center my-auto">+</button>
            <h3 className="font-bold text-3xl flex items-center">{index > -1 ? props.cart.find(item => item.id === props.id).quantity : <></>}</h3>
        </div>
    )
}