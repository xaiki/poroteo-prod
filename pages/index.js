import React from 'react'
import Tarjeta from '../components/tarjeta'
import FechaActualizacion from '../components/fecha-actualizacion'
import Cambios from '../components/cambios'
import Layout from '../components/layout'

import GSheet from 'picosheet'
import LocalForage from 'localforage'

import { VOTE_TYPE, VOTE_CLASS } from '../constants'

const KEY = 'senadores'

const store = LocalForage.createInstance({
  name: 'poroteo'
})

const processVotes = (data) => data.reduce((votes, p) => {
  if      (p.PosicionCON_MODIF === VOTE_TYPE.AFAVOR) { votes.aFavor++ }
  else if (p.PosicionCON_MODIF === VOTE_TYPE.CONTRA) { votes.enContra++ }
  else if (p.PosicionCON_MODIF === VOTE_TYPE.NOCONF) { votes.noConfirmado++ }
  else if (p.PosicionCON_MODIF === VOTE_TYPE.ABSTEN) { votes.seAbstiene++ }
  else { console.error('no data', p) }

  return votes
}, {
  aFavor: 0,
  enContra: 0,
  noConfirmado: 0,
  seAbstiene: 0
})

const diffVotes = (current, previous) => current.reduce((changed, p, i) => {
  if (!previous) { return [] }

  if (p.PosicionCON_MODIF !== previous[i].PosicionCON_MODIF) {
    changed.push({
      name: p.Senador,
      from: previous[i].PosicionCON_MODIF,
      to: p.PosicionCON_MODIF,
      changed: Date.now()
    })
  }

  return changed
}, [])

const processState = ({ votes, changed }) => ({
  votos: [
    {
      'titulo': 'A favor',
      'votos': votes.aFavor,
      'color': 'tarjeta-afavor'
    },
    {
      'titulo': 'En contra',
      'votos': votes.enContra,
      'color': 'tarjeta-encontra'
    },
    {
      'titulo': 'No confirmados',
      'votos': votes.noConfirmado,
      'color': 'tarjeta-noconfirmados'
    },
    {
      'titulo': 'Se abstienen',
      'votos': votes.seAbstiene,
      'color': 'tarjeta-abstenciones'
    }
  ],
  fecha: Date.now(),
  changed
})

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    this.update()
  }

  update () {
    Promise.all([
      GSheet('143fmK1J9Lj9z2gc2EuCyzy9b5d72a32_N0GDveKMrvo', 0, 200),
      store.getItem(KEY)
    ]).then(([current, previous]) => {
      store.setItem(KEY, current)
      this.setState(state => processState({
        votes: processVotes(current),
        changes: diffVotes(current, previous),
      }))
    })
  }

  render () {
    const { votos } = this.state
    return (
      <Layout>
        {
          votos &&
          <div className='fila'>
            {votos.map((voto, i) => [
                  <Tarjeta posicion={voto} />,
              <div className='divisor' />
            ])}
          </div>
        }
        {this.state.fecha &&
        <FechaActualizacion fecha={this.state.fecha} />
        }
        <Cambios changed={this.state.changed} />
        <style jsx>{`
             .fila {
                margin: auto;
                width: 90%;
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: flex-start;
                margin-top: 20px;
                margin-bottom: 35px;
              }
              @media (max-width: 767px) {
                .fila {
                  display: block;
                }
              }
              .divisor {
                width:100%;
                min-height:10px;
              }
                `}
        </style>
      </Layout>
    )
  }
}
