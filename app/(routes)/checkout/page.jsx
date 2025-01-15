'use client'
import GlobalApi from '@/app/_utils/GlobalApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { ArrowBigRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

function CheckOut() {

    const ISSERVER = typeof window === "undefined"; // Tarayıcı kontrolü
    const user = !ISSERVER ? JSON.parse(sessionStorage.getItem('user')) || {} : {}; // Tarayıcı ortamı dışında boş obje
    const jwt = !ISSERVER ? sessionStorage.getItem('jwt') : null; // Tarayıcı ortamı dışında null
    const [totalCartItem, setTotalCartItem] = useState(0);
    const [cartItemList, setCartItemList] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [zip, setZip] = useState();
    const [address, setAddress] = useState();

    const [totalAmount, setTotalAmount] = useState();

    const router = useRouter();

    useEffect(() => {
        if (!jwt) {
            router.push('/sign-in')
        }
        getCartItems();
    }, [])

    const getCartItems = async () => {
        const cartItemList_ = await GlobalApi.getCardItems(user.id, jwt);
        console.log(cartItemList_);
        setTotalCartItem(cartItemList_?.length)
        setCartItemList(cartItemList_);
    }

    useEffect(() => {
        let total = 0;
        cartItemList.forEach(element => {
            total = total + element.amount
        });
        setTotalAmount((Number(total) + 20).toFixed(2));
        setSubtotal(total.toFixed(2))
    }, [cartItemList])

    const calculateTotalAmount = () => {
        const totalAmount = Number(subtotal) + 20
        return totalAmount.toFixed(2)
    }

    const onApprove = (data) => {
        console.log(data);
        console.log(typeof totalAmount, totalAmount);

        const payload = {
            data: {
                paymentId: (data.paymentId).toString(),
                totalOrderAmount: totalAmount,
                username: username,
                email: email,
                phone: phone,
                zip: zip,
                address: address,
                orderItemLists: cartItemList,
                userId: user.id
            }
        }

        GlobalApi.createOrder(payload, jwt).then(resp => {
            console.log(resp);
            toast('Sipariş Başariyla Verildi');
            cartItemList.forEach((item, index) => {
                GlobalApi.deleteCartItem(item.id).then(resp => {
                })
            })
            router.replace('/order-confirmation');
        })
    }

    return (

        <div>
            <h2 className='p-3 bg-red-400 text-xl font-bold text-center text-white'>Ödeme</h2>
            <div className='p-5 px-5 md:px-10 grid grid-cols-3 md:grid-cols-3 py-8'>
                <div className='md:col-span-2 mx-20'>
                    <h2 className='font-bold text-3xl'>Ödeme Detayları</h2>
                    <p className='text-sm text-gray-500 mt-1'>
                        PayPal ile ödeme yapmak için lütfen sayfayı yenileyiniz.
                    </p>
                    <div className='grid grid-cols-2 gap-10 mt-3'>
                        <Input placeholder='İsim' onChange={(e) => setUsername(e.target.value)} />
                        <Input placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className='grid grid-cols-2 gap-10 mt-3'>
                        <Input placeholder='Telefon' onChange={(e) => setPhone(e.target.value)} />
                        <Input placeholder='Posta Kodu' onChange={(e) => setZip(e.target.value)} />
                    </div>
                    <div className='mt-3'>
                        <Input placeholder='Adres' onChange={(e) => setAddress(e.target.value)} />
                    </div>
                </div>
                <div className='mx-10 border'>
                    <h2 className='p-3 bg-gray-200 font-bold text-center'>Toplam Ürün ({totalCartItem})</h2>
                    <div className='p-4 flex flex-col gap-4'>
                        <h2 className='font-bold flex justify-between'>Ara Toplam : <span>${subtotal}</span></h2>
                        <hr />
                        <h2 className='flex justify-between'>Kargo Ücreti : <span>$20.00</span></h2>
                        <hr />
                        <h2 className='font-bold flex justify-between'>Toplam : <span>${calculateTotalAmount()}</span></h2>
                        <Button onClick={() => onApprove({ paymentId: 123 })} className='bg-red-600'>Öde <ArrowBigRight /></Button>
                        <PayPalButtons
                            disabled={!(username && email && address && zip)}
                            style={{ layout: "horizontal" }}
                            createOrder={(data, actions) => {
                                try {
                                    const amount = Number(totalAmount); // totalAmount'ı sayıya çeviriyoruz
                                    if (isNaN(amount)) {
                                        throw new Error('Total amount is invalid.');
                                    }

                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: amount.toFixed(2), // Toplam tutarı string olarak döndür
                                                    currency_code: 'USD',
                                                },
                                            },
                                        ],
                                    });
                                } catch (error) {
                                    console.error('Create Order Error:', error);
                                    return Promise.reject(error);
                                }
                            }}
                            onApprove={async (data, actions) => {
                                const order = await actions.order.capture();
                                if (!username || !email || !phone || !zip || !address) {
                                    toast.error('Lütfen tüm alanları doldurunuz!');
                                    return;
                                }
                                onApprove({
                                    paymentId: order.id, // Payment ID alınıyor
                                });
                            }}
                            onError={(err) => {
                                console.error('PayPal Error:', err);
                            }}
                        />

                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOut
