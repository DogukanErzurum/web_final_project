"use client"
import React, { useContext } from 'react'
import Image from 'next/image'
import { CircleUserRound, LayoutGrid, Search, ShoppingBag, ShoppingBasket } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import GlobalApi from '../_utils/GlobalApi'
import { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { UpdateCartContext } from '../_context/UpdateCartContext'
import CartItemList from './CartItemList'
import { toast } from 'sonner'


function Header() {

    const [CategoryList, setCategoryList] = useState([]);
    const isLogin = typeof window !== "undefined" && sessionStorage.getItem("jwt") ? true : false;
    const user = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("user")) : null;
    const jwt = typeof window !== "undefined" ? sessionStorage.getItem("jwt") : null;
    const [totalCartItem, setTotalCartItem] = useState(0);
    const { updateCart, setUpdateCart } = useContext(UpdateCartContext)
    const [cartItemList, setCartItemList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getCategoryList();
    }, []);

    useEffect(() => {
        getCartItems();
    }, [updateCart])

    /**
     * Get Category List
     */

    const getCategoryList = () => {
        GlobalApi.getCategory().then(resp => {
            setCategoryList(resp.data.data);
        })
    }

    const getCartItems = async () => {
        const cartItemList_ = await GlobalApi.getCardItems(user.id, jwt);
        console.log(cartItemList_);
        setTotalCartItem(cartItemList_?.length)
        setCartItemList(cartItemList_);
    }

    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        let total = 0;
        cartItemList.forEach(element => {
            total = total + element.amount
        });
        setSubtotal(total.toFixed(2))
    }, [cartItemList])

    const onDeleteItem = (id) => {
        GlobalApi.deleteCartItem(id, jwt).then(resp => {
            toast('Ürün Silindi')
            getCartItems();
        })
    }

    const onSignOut = () => {
        if (typeof window !== "undefined") {
            sessionStorage.clear();
            router.push('/sign-in');
        }
    }

    return (
        <div className='p-5 shadow-md flex justify-between'>
            <div className='flex items-center gap-8'>
                <div className='flex flex-col items-center'>
                    <Link href='/'>
                        <Image src='/logo.png' alt='logo' width={80} height={60} className='cursor-pointer' />
                    </Link>
                    <span className='text-center text-sm mt-2'><b>Arif Işık</b></span>
                    <span className='text-center text-sm mt-2'><b>Halı, Kilim, Travel</b></span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className='hidden md:flex gap-2 items-center
                    border rounded-full p-2 px-10 bg-slate-200 cursor-pointer
                    '>
                            <LayoutGrid className='h-5 w-5' />Kategori
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Kategorileri Keşfet</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {CategoryList.map((category, index) => (
                            <Link key={index} href={'/products-category/' + category.attributes.name}>
                                <DropdownMenuItem className='flex gap-2 items-center cursor-pointer'>
                                    <Image
                                        src={category?.attributes?.icon?.data?.attributes?.url.startsWith('http')
                                            ? category?.attributes?.icon?.data?.attributes?.url
                                            : process.env.NEXT_PUBLIC_BACKEND_BASE_URL + category?.attributes?.icon?.data?.attributes?.url
                                        }
                                        alt={category?.attributes?.icon?.data?.attributes?.name || 'icon'}
                                        width={23}
                                        height={23}
                                    />
                                    <h2 className='text-lg'>{category?.attributes?.name}</h2>
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='md:flex gap-3 items-center border rounded-full p-2 px-5 hidden'>
                    <Search />
                    <input type="text" placeholder='Arama' className='outline-none' />
                </div>
            </div>
            <div className='flex gap-5 items-center'>

                <Sheet>
                    <SheetTrigger>
                        <h2 className='flex gap-2 items-center text-lg'> <ShoppingBasket className='h-7 w-7' />
                            <span className='bg-red-100 font-bold text-black px-2 rounded-full'>{totalCartItem}</span>
                        </h2>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className="bg-red-600 text-white font-bold text-lg p-2">Sepetim</SheetTitle>
                            <SheetDescription>
                                <CartItemList cartItemList={cartItemList} onDeleteItem={onDeleteItem} />
                            </SheetDescription>
                        </SheetHeader>
                        <SheetClose asChild>
                            <div className='absolute w-[90%] bottom-6 flex flex-col'>
                                <h2 className='text-lg font-bold flex justify-between '>Ara Toplam : <span>${subtotal}</span></h2>
                                <Button onClick={() => router.push(jwt ? '/checkout' : '/sign-in')}> Sepeti Onayla</Button>
                            </div>
                        </SheetClose>
                    </SheetContent>
                </Sheet>

                {!isLogin ? <Link href={'/sign-in'}>
                    <Button>Giriş</Button>
                </Link>
                    :
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound className="bg-green-100 h-12 w-12 p-2 rounded-full cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profil</DropdownMenuItem>
                            <Link href={'/my-order'}>
                                <DropdownMenuItem>Siparişlerim</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => onSignOut()}>Çıkış Yap</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                }


            </div>
        </div>
    )
}

export default Header
