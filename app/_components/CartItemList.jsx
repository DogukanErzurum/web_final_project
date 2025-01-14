import { Button } from '@/components/ui/button'
import { TrashIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

function CartItemList({ cartItemList, onDeleteItem }) {
    return (
        <div >
            <div className='h-[750px] overflow-auto'>
                {cartItemList.map((cart, index) => (
                    <div className='flex justify-between items-center p-2 mb-5'>
                        <div className='flex gap-6 items-center'>
                            <Image
                                src={cart.image.startsWith("http") ? cart.image : "/default-image.png"} 
                                width={70}
                                height={70}
                                alt={cart.name}
                                className="border p-2"
                            />
                            <div>
                                <h2 className='font-bold'>{cart.name}</h2>
                                <h2 className=''>Adet : {cart.quantity}</h2>
                                <h2 className='text-lg font-bold'>${cart.amount}</h2>
                            </div>
                        </div>
                        <TrashIcon className='cursor-pointer' onClick={() => onDeleteItem(cart.id)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CartItemList
