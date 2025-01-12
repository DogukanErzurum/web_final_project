'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import GlobalApi from '@/app/_utils/GlobalApi'
import { useRouter } from 'next/navigation'
import { toast } from "sonner"

function CreateAccount() {

    const onCreateAccount = ()=>{
        GlobalApi.registerUser(username,email,password).then(resp=>{
            sessionStorage.setItem('user',JSON.stringify(resp.data.user));
            sessionStorage.setItem('jwt',resp.data.jwt);
            toast("Hesap Başarıyla Oluşturuldu. Arif Işık Dükkanına Hoş Geldiniz.")

            router.push('/');
        },(e)=>{
            toast("Hesap oluşturma sırasında hata")
        })
    }

    useEffect(()=>{
        const jwt = sessionStorage.getItem('jwt');
        if(jwt){
            router.push('/')
        }
    },[])

    const [username,setUsername]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const router=useRouter();

    return (
        <div className='flex items-baseline justify-center my-20'>
            <div className='flex flex-col items-center justify-center p-10 bg-slate-100 border border-gray-200'>
                <Image src='/logo.png' alt='logo' width={200} height={200}/>
                <h2 className='font-bold text-3xl'>Hesap Oluştur</h2>
                <h2 className='text-gray-500'>Email adresinizi ve şifrenizi girerek hesap oluşturun</h2>
                <div className='w-full flex flex-col gap-5 mt-7'>
                    <Input placeholder='Kullanıcı Adı' onChange={(e)=>setUsername(e.target.value)}/>
                    <Input placeholder='email@gmail.com' onChange={(e)=>setEmail(e.target.value)}/>
                    <Input type='password' placeholder='Şifre' onChange={(e)=>setPassword(e.target.value)}/>
                    <Button onClick={()=>onCreateAccount()} disabled={!(username && email && password)}> Hesap Oluştur </Button>
                    <p>Zaten bir hesabım var   
                        <Link href={'/sign-in'} className='text-blue-500 '>
                            Giriş Yap
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default CreateAccount
