import StoreHeader from '@/components/store/StoreHeader'
import StoreFooter from '@/components/store/StoreFooter'
import CartDrawer from '@/components/store/CartDrawer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main style={{ minHeight: '80vh' }}>{children}</main>
      <StoreFooter />
      <CartDrawer />
    </>
  )
}
