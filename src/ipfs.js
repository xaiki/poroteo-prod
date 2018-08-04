const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
const constants = require('./constants')

const ipfsOptions = {
    EXPERIMENTAL: {
        pubsub: true
    },
    config: {
        Addresses: {
            Swarm: [
                // Use IPFS dev signal server
                // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                // Use local signal server
                // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            ]
        }
    }
}

export default () => new Promise((accept, reject) => {
    const ipfs = new IPFS(ipfsOptions)

    ipfs.on('error', (e) => console.error(e))
    ipfs.on('ready', async () => {
        const orbitdb = new OrbitDB(ipfs)

        // Create / Open a database
        console.log('connecting to', constants.IPFS_DB)
        const db = await orbitdb.log(constants.IPFS_DB, {sync: true})

        db.events.on('ready', () => console.log('ready'))
        db.events.on('replicated', () => console.log('replicated'))
        db.events.on('write', () => console.log('write'))

        db.events.on('replicate.progress', () => console.log('replicate progress'))

        db.events.on('ready', () => {
            console.log('Database is ready')

            return accept(db)
        })

        await db.load()
    })
})
