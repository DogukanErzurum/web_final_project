"use client"

import { Button } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import GlobalApi from '../_utils/GlobalApi'
import { toast } from 'sonner'
import { UpdateCartContext } from '../_context/UpdateCartContext'

function ProductItemDetail({ product }) {

    const jwt = sessionStorage.getItem('jwt');
    const user = JSON.parse(sessionStorage.getItem('user'))
    const { updateCart, setUpdateCart } = useContext(UpdateCartContext)
    const [productTotalPrice, setProductTotalPrice] = useState(
        product.attributes.sellingPrice ?
            product.attributes.sellingPrice :
            product.attributes.actualPrice
    )

    const router = useRouter();
    const [quantity, setQuantity] = useState(1)

    const addToCart = () => {
        if (!jwt) {
            router.push('/sign-in')
            return
        }

        const data = {
            data: {
                quantity: quantity,
                amount: (quantity * productTotalPrice).toFixed(2),
                products: product.id,
                users_permissions_user: user.id,
                userId: user.id
            }
        }

        console.log(data);
        GlobalApi.addToCart(data, jwt).then(resp => {
            console.log(resp)
            toast('Sepete Eklendi!')
            setUpdateCart(!updateCart)
        }, (e) => {
            toast('Sepete Eklenemedi!')
        })
    }

    const productImage = product.attributes.images.data[0]?.attributes.url;

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 p-7 bg-white text-black '>
            <Image
                src={
                    productImage?.startsWith("http")
                        ? productImage
                        : "/default-image.png" // Eğer URL eksikse varsayılan bir görsel kullan
                }
                width={300}
                height={300}
                alt={product.attributes.name || "Product Image"}
                className="bg-slate-200 p-5 h-[520px] w-[300px] object-contain rounded-lg"
            />
            <div className='flex flex-col gap-3'>
                <h2 className='text-2xl font-bold'>{product.attributes.name}</h2>
                <h2 className='text-sm text-gray-500'>{product.attributes.description}</h2>
                <div className='flex gap-3 '>
                    {product.attributes.sellingPrice &&
                        <h2 className='font-bold text-2xl'>${product.attributes.sellingPrice}</h2>
                    }
                    <h2 className={`font-bold text-xl ${product.attributes.sellingPrice && 'line-through text-gray-500'}`}>${product.attributes.actualPrice}</h2>
                </div>
                <h2 className='font-medium text-lg'>Adet({product.attributes.itemQuantitiyType})</h2>
                <div className='flex flex-col items-baseline gap-3'>
                    <div className='flex gap-3 items-center'>
                        <div className='p-2 border flex gap-10 items-center px-5'>
                            <button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)}>-</button>
                            <h2>{quantity}</h2>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <h2 className='text-2xl font-bold'> = ${(quantity * productTotalPrice).toFixed(2)}</h2>
                    </div>
                    <Button className="flex gap-3" onClick={() => addToCart()}>
                        <ShoppingBasket />
                        Sepete Ekle
                    </Button>
                </div>
                <h2> <span className='font-bold'>Kategori:</span> {product.attributes.categories.data[0].attributes.name}</h2>
            </div>
        </div>
    )
}

export default ProductItemDetail
