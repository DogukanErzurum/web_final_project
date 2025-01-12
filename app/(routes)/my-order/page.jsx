"use client"

import GlobalApi from '@/app/_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import moment from 'moment/moment';


function MyOrder() {
    const ISSERVER = typeof window === "undefined";
    const jwt = !ISSERVER ? sessionStorage.getItem('jwt') : null;
    const user = !ISSERVER ? JSON.parse(sessionStorage.getItem('user') || "{}") : {};
    const router = useRouter();
    const [orderList,setOrderList]=useState([]);
    useEffect(() => {
        if (!jwt) {
            router.replace('/');
        };
        getMyOrder();
    }, []);

    const getMyOrder = async () => {
        const orderList_ = await GlobalApi.getMyOrder(user.id, jwt);
        console.log(orderList_);
        setOrderList(orderList_)
    }

    return (
        <div>
            <h2 className='p-3 bg-red-400 text-xl font-bold text-center text-white'>Siparişlerim</h2>
            <div className='py-8 mx-7 md:mx-20'>
                <h2 className='text-3xl font-bold text-red-400'>Geçmiş Siparişlerim</h2>
                <div>
                    {orderList.map((item,index)=>(
                        <Collapsible key={index}>
                        <CollapsibleTrigger>
                        <div className='border p-2 bg-slate-100 flex justify-evenly gap-24'>
                            <h2> <span className='font-bold mr-2'>Sipariş Tarihi:</span>{moment(item?.createdAt).format('DD/MMM/yyy')}</h2>
                            <h2> <span className='font-bold mr-2'>Toplam Ücret:</span>{item?.totalOrderAmount}</h2>
                            <h2> <span className='font-bold mr-2'>Durum:</span>Ödendi</h2>
                        </div>
                        </CollapsibleTrigger>
                    </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyOrder
