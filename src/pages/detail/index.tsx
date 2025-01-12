import { useParams ,useNavigate, data} from 'react-router'
import { useEffect,useState } from 'react'
import styles from './detail.module.css'


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

interface responseData{
    data:CoinProps
}

interface ErrorData{
    error: string;
}

type DataProps = responseData | ErrorData;

export function Detail(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [coin,setCoin] = useState<CoinProps>();
    const [load,setLoad] = useState(true);
    useEffect(()=>{
        async function getCoin() {
            try{
                fetch(`https://api.coincap.io/v2/assets/${id}`)
                .then(response =>response.json())
                .then((respostaREQ:DataProps)=>{
                    if("error" in respostaREQ) {
                        navigate("/");
                    }
                const price = Intl.NumberFormat("en-US",{
                    style:"currency",
                    currency:"USD"
                });
    
                const priceCompact = Intl.NumberFormat("en-US",{
                    style:"currency",
                    currency:"USD",
                    notation:"compact"
                });

                const RESULTADO = {
                    ...respostaREQ.data,
                    formatedPrice:price.format(Number(respostaREQ.data.priceUsd)),
                    formatedMarket: priceCompact.format(Number(respostaREQ.data.marketCapUsd)),
                    formatedVolume:priceCompact.format(Number(respostaREQ.data.volumeUsd24Hr))
                }

                setCoin(RESULTADO);  
                setLoad(false)             
                })

                

            }catch(err){
                console.log(err);
                navigate("/")
            }
        }
        getCoin();
    },[id]);

    if(load || !coin){
        return(
            <div className={styles.container}>
                <h3 className={styles.center}>Carregando detalhes...</h3>
            </div>
        )
    }

    return(
        <div className={styles.container}>
            <h1 className={styles.center}>{coin?.name}</h1>
            <section className={styles.content}>
            <h1>{coin?.name} | {coin?.symbol}</h1>
            <p><strong>Preço: </strong>{coin?.formatedPrice}</p>
            
            <a>
                <strong>Mercado: </strong>{coin?.formatedMarket}
            </a>

            <a>
            <strong>Volume: </strong>{coin?.formatedVolume}
            </a>

            <a>
            <strong>Mudança 24h: </strong><span className={Number(coin?.changePercent24Hr)>0 ? styles.profit:styles.loss}>{Number(coin?.changePercent24Hr).toFixed(2)}</span>
            </a>
            </section>
        </div>
    )
}


{/* <td className={Number(item.changePercent24Hr)>0 ? styles.tdProfit:styles.tdLoss} data-Label="Mudança 24h">
<span>{Number(item.changePercent24Hr).toFixed(2)}</span>
</td> */}