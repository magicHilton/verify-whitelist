import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styles from './index.module.css'
import React from 'react'
interface INavMenus {
  showMenu: boolean
  updateShowMenu: () => void
}

export const menuList = ['about', 'story', 'mint']

const NavMenus: React.FC<INavMenus> = (props) => {
  console.log(props.showMenu)
  return (
    <>
      <nav className={styles.nav}>
        <Link href={'/'} className={styles.title}>
          NEXT.JS
        </Link>
        <div className={styles.navLink}>
          {menuList.map((i) => (
            <Link key={i} href={`/${i}`}>
              {i}
            </Link>
          ))}
        </div>
        <div>
          {/* pc */}
          <div className={styles.btn}>
            <ConnectButton />
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
