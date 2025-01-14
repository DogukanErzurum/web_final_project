import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetail from './ProductItemDetail'


function ProductItem({ product }) {

    const productImage = product.attributes.images.data[0]?.attributes.url;

    return (
        <div className='p-2 md:p-6 flex flex-col items-center justify-center gap-3 border rounded-lg hover:scale-105 hover:shadow-md transition-all ease-in-out cursor-pointer'>
            <Image
                src={productImage?.startsWith('http')
                    ? productImage
                    : '/default-image.png' // Eğer URL eksikse varsayılan bir görsel kullan
                }
                width={500}
                height={200}
                alt={product.attributes.name || 'Product Image'}
                className='h-[250px] w-[200px] object-contain'
            />
            <h2 className='font-bold text-lg'>{product.attributes.name}</h2>
            <div className='flex gap-3'>
                {product.attributes.sellingPrice &&
                    <h2>${product.attributes.sellingPrice}</h2>
                }
                <h2 className={`font-bold ${product.attributes.sellingPrice && 'line-through text-gray-500'}`}>${product.attributes.actualPrice}</h2>
            </div>



            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className='text-red-500 hover:text-white hover:bg-red-600'> Sepete Ekle </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogDescription>
                            <ProductItemDetail product={product}/>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default ProductItem
