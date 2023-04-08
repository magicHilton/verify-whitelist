import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './index.module.css'
import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
interface INavMenus {
  showMenu: boolean
  updateShowMenu: () => void
}

export const menuList = ['/', '/about', '/story', '/mint']

const NavMenus: React.FC<INavMenus> = (props) => {
  const router = useRouter()
  return (
    <>
      <nav className={styles.nav}>
        <Link href={'/'} className={styles.title}>
          NEXT.JS
        </Link>
        <div className={styles.navLink}>
          {menuList.map((i, index) => (
            <Link
              key={i}
              href={i}
              className={router.pathname === i ? styles.navActive : ''}
            >
              {i === '/' ? 'home' : i.replace('/', '')}
            </Link>
          ))}
        </div>
        <div>
          {/* pc */}
          <div className={styles.btn}>
            <ConnectButton
              chainStatus="icon"
              showBalance={{
                smallScreen: false,
                largeScreen: false,
              }}
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'address',
              }}
            />
          </div>
          {/* mobile */}
          <div>
            <div
              className={`${styles.mobileIcon} ${
                props.showMenu && styles.moblieCloseIcon
              }`}
              onClick={props.updateShowMenu}
            ></div>
          </div>
        </div>
      </nav>
    </>
  )
}

export default NavMenus
