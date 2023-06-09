
const r2YodaConnection = process.env.REACT_APP_YODA
const r2PadmeConnection = process.env.REACT_APP_PADME

export const config = {
    connections: {
        yoda: r2YodaConnection,
        padme: r2PadmeConnection
    }
}
