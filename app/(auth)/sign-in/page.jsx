'use client'
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function SignIn() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const router=useRouter();

    useEffect(()=>{
        const jwt = sessionStorage.getItem('jwt');
        if(jwt){
            router.push('/')
        }
    },[])
    const onSignIn = () => {
        GlobalApi.signIn(email, password).then(resp => {
            sessionStorage.setItem('user', JSON.stringify(resp.data.user));
            sessionStorage.setItem('jwt', resp.data.jwt);
            toast("Başarıyla Giriş Yapıldı. Arif Işık Dükkanına Tekrardan Hoş Geldiniz.")
            router.push('/');

        }, (e) => {
            console.log(e)
            toast("Giriş Sırasında Hata Oluştu")
        })
    }


    return (
        <div className='flex items-baseline justify-center my-20'>
            <div className='flex flex-col items-center justify-center p-10 bg-slate-100 border border-gray-200'>
                <Image src='/logo.png' alt='logo' width={200} height={200} />
                <h2 className='font-bold text-3xl'>Giriş Yap</h2>
                <h2 className='text-gray-500'>Email adresinizi ve şifrenizi girerek giriş yapınız</h2>
                <div className='w-full flex flex-col gap-5 mt-7'>
                    <Input placeholder='email@gmail.com' onChange={(e) => setEmail(e.target.value)} />
                    <Input type='password' placeholder='Şifre' onChange={(e) => setPassword(e.target.value)} />
                    <Button onClick={() => onSignIn()} disabled={!(email && password)}> Giriş Yap </Button>
                    <p>Henüz bir hesabınız yok mu?
                        <Link href={'/create-account'} className='text-blue-500 '>
                            Kayıt Ol!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignIn
