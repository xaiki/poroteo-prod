import React from 'react'

import Tarjeta from '../components/tarjeta'

import { Link } from 'react-router-dom'
import { SENATORS_KEY } from '../constants'

const Home = ({ match, votos = [] }) => (
    <div className='fila'>
        {votos.map((voto, i) => <Link to={`/${SENATORS_KEY}/${voto.titulo}`}>
            <Tarjeta posicion={voto} />
            <div className='divisor' />
        </Link>
        )}
        <style jsx>{`
           .divisor {
                    width:100%;
                    min-height:10px;
           }
            `}</style>
    </div>
)

export default Home
