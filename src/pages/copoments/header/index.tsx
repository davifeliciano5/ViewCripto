import styles from './header.module.css'
import { Link } from 'react-router'
export function Header(){
    return(
        <header className={styles.container}>
           
            <Link to={"/"}><h1 className={styles.logo}>View<span>Cripto</span></h1></Link> 
        </header>
    )
}