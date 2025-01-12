import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link,useNavigate } from 'react-router'
import { useEffect,useState, FormEvent } from 'react'


interface CoinProps{
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24Hr: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;
}

interface DataProp{
    data: CoinProps[]
}

export function Home(){
    const navegar = useNavigate();
    const [input,setInput] = useState<string>();
    const [coins,setCoins] = useState<CoinProps[]>([])
    const [offset,setOffSet] = useState(0);
    const [load,setLoad] = useState(true);

    useEffect(()=>{
        getCoin();
    }, [offset]);

    async function getCoin() {
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset }`)
        .then(response => response.json())
        .then((data: DataProp)=>{
            const coinData = data.data;

            const price = Intl.NumberFormat("en-US",{
                style:"currency",
                currency:"USD"
            });

            const priceCompact = Intl.NumberFormat("en-US",{
                style:"currency",
                currency:"USD",
                notation:"compact"
            });


            const formatedResult = coinData.map((item)=>{
                const formated = {
                    ...item,
                    formatedPrice:price.format(Number(item.priceUsd)),
                    formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                    formatedVolume:priceCompact.format(Number(item.volumeUsd24Hr))
                }
                return formated;
            })
            const listcOINS = [...coins,...formatedResult]
            setCoins(listcOINS);
            setLoad(false);
        })  
    };

    function handleSearch(e: FormEvent){
        e.preventDefault();

        if(input === '') return;

        navegar(`/detail/${input}`);
    }

    function handleMore(){
        if(offset === 0){
            setOffSet(10);
            return;
        }
        setOffSet(offset + 10);
    }

    if(load){
      return(
        <div>
            <h1 className={styles.load}>Carregando...</h1>
        </div>
      )  
    };

    return(
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSearch}>
            <input type="" 
            placeholder='Digite o nome da moeda'
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            />
            <button type='submit'>
                {<BsSearch size={30} color='#FFF'/>}
            </button>
          </form>

          <table>
            <thead>
                <tr>
                    <th scope='col'>Moeda</th>
                    <th scope='col'>Valor mercado</th>
                    <th scope='col'>Preço</th>
                    <th scope='col'>Volume</th>
                    <th scope='col'>Mudança 24h</th>

                </tr>

            </thead>  
            <tbody id='tbody'>
               {coins.length > 0 && coins.map((item)=>(
                 <tr className={styles.tr} key={item.id}>
                 <td className={styles.tdlabel} data-label="Moeda">
                     <div className={styles.name}>
                         <Link to={`/detail/${item.id}`}>
                             <span>{item.name}</span> | {item.symbol}
                         </Link>
                     </div>
                 </td>

                 <td className={styles.tdlabel} data-label="Valor mercado">
                     {item.formatedMarket}
                 </td>

                 <td className={styles.tdlabel} data-label="Preço">
                     {item.formatedPrice}
                 </td>

                 
                 <td className={styles.tdlabel} data-label="Volume">
                     {item.formatedVolume}
                 </td>

                 <td className={Number(item.changePercent24Hr)>0 ? styles.tdProfit:styles.tdLoss} data-label="Mudança 24h">
                     <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                 </td>
             </tr>
               ))}
            </tbody>
          </table> 
            <button className={styles.mostrar} onClick={handleMore}>Mostrar mais</button>

        </div>
    )
}